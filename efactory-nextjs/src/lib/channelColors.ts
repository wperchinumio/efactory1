import mapping from '@/config/channel-colors.json';

export type ChannelCode = string;

export type ChannelColor = {
  bg: string;
  text: string;
};

export function getChannelColor(code?: ChannelCode): ChannelColor {
  const key = (code || '').toUpperCase();
  const found = (mapping as Record<string, ChannelColor>)[key] || (mapping as any)._default;
  return found as ChannelColor;
}

export function getChannelClassNames(code?: ChannelCode): string {
  const { bg, text } = getChannelColor(code);
  return `rounded px-2 py-0.5 text-[11px] font-semibold`;
}


