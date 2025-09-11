import React, { useEffect, useState } from 'react'
import { Button, Card, Input, ScrollArea } from '@/components/ui'
import { readAddresses, createAddress, updateAddress, deleteAddress, validateAddress } from '@/services/api'
import type { AddressDto, ReadAddressesResponse } from '@/types/api/orderpoints'

export default function AddressBookPage() {
  const [rows, setRows] = useState<ReadAddressesResponse['rows']>([])
  const [filter, setFilter] = useState('')
  const [activePagination, setActivePagination] = useState(1)
  const [pageSize] = useState(100)

  async function reload() {
    const res = await readAddresses({ action: 'read_addresses', page_num: activePagination, page_size: pageSize, filter: filter ? { and: [{ field: 'name', oper: '=', value: filter }] } as any : undefined })
    setRows(res.rows || [])
  }

  useEffect(()=>{ reload() }, [activePagination])

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Input placeholder="Search" value={filter} onChange={e=>setFilter(e.target.value)} onKeyDown={e=>{ if (e.key==='Enter') reload() }} style={{ maxWidth: 260 }} />
        <Button onClick={reload}>Search</Button>
      </div>
      <Card>
        <ScrollArea style={{ maxHeight: 520 }}>
          <table className="min-w-full text-xs">
            <thead>
              <tr>
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Ship To</th>
                <th className="p-2 text-left">Bill To</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{r.title}</td>
                  <td className="p-2">{displayAddr(r.ship_to)}</td>
                  <td className="p-2">{displayAddr(r.bill_to)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </Card>
    </div>
  )
}

function displayAddr(a?: AddressDto) {
  if (!a) return '-'
  const parts = [a.address1, a.address2, a.city, a.state_province, a.postal_code].filter(Boolean)
  return parts.join(', ')
}


