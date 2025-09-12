import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';

export const config = {
	api: {
		bodyParser: false, // Disable to handle FormData
	},
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
	if (!base) {
		return res.status(500).json({ error_message: 'Missing NEXT_PUBLIC_API_BASE_URL' });
	}
	const slug = Array.isArray(req.query.slug) ? req.query.slug.join('/') : req.query.slug || '';
	
	// Build query parameters (excluding 'slug' which is the path)
	const queryParams = new URLSearchParams();
	for (const [key, value] of Object.entries(req.query)) {
		if (key !== 'slug' && value) {
			if (Array.isArray(value)) {
				value.forEach(v => queryParams.append(key, v));
			} else {
				queryParams.append(key, String(value));
			}
		}
	}
	
	const queryString = queryParams.toString();
	const target = `${base}/${slug}${queryString ? `?${queryString}` : ''}`;

	const { method = 'GET' } = req;

	// Log the target URL for debugging

	const headers: Record<string, string> = {};
	for (const [key, value] of Object.entries(req.headers)) {
		if (!value) continue;
		const lower = key.toLowerCase();
		// skip hop-by-hop and host-specific headers
		if (['host', 'connection', 'content-length'].includes(lower)) continue;
		headers[lower] = Array.isArray(value) ? value.join(',') : String(value);
	}
	
	// Handle different content types
	const contentType = req.headers['content-type'] || '';
	let body: BodyInit | undefined = undefined;
	
	if (method !== 'GET' && method !== 'HEAD') {
		if (contentType.includes('multipart/form-data')) {
			// Handle FormData (file uploads)
			const form = formidable({
				maxFileSize: 5 * 1024 * 1024, // 5MB
				keepExtensions: true,
			});
			
			const [fields, files] = await form.parse(req);
			
			// Create new FormData for upstream request
			const formData = new FormData();
			
			// Add fields
			for (const [key, value] of Object.entries(fields)) {
				const fieldValue = Array.isArray(value) ? value[0] : value;
				if (fieldValue) {
					formData.append(key, fieldValue);
				}
			}
			
			// Add files
			for (const [key, file] of Object.entries(files)) {
				const fileObj = Array.isArray(file) ? file[0] : file;
				if (fileObj && fileObj.filepath) {
					formData.append(key, fileObj as any);
				}
			}
			
			body = formData;
			// Don't set content-type header for FormData, let fetch handle it
		} else {
			// Handle JSON data
			headers['accept'] = headers['accept'] || 'application/json';
			if (!headers['content-type']) headers['content-type'] = 'application/json';
			body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {});
		}
	}

	try {
		const upstream = await fetch(target, {
			method,
			headers,
			body: body || null,
			redirect: 'manual',
		});

		const contentType = upstream.headers.get('content-type') || 'application/json';
		const text = await upstream.text();
		res.status(upstream.status);
		res.setHeader('content-type', contentType);
		return res.send(text);
	} catch (e: any) {
		return res.status(502).json({ error_message: 'Proxy error', details: e?.message });
	}
}
