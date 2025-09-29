import { NextResponse } from "next/server";

type Lease = {
  id: number;
  display_name: string;
  date_end: string;
  current_rent: number;
  space: number;
  main_property_id: [number, string] | number;
};

async function odooCall<T>(
  model: string,
  method: string,
  domain: any[],
  fields: string[]
): Promise<T[]> {
  const payload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [
        process.env.ODOO_DB,
        parseInt(process.env.ODOO_USER_UUID || "0", 10),
        process.env.ODOO_API,
        model,
        method,
        domain,
        { fields },
      ],
    },
    id: new Date().getTime(),
  };

  const res = await fetch(`${process.env.ODOO_URL}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  return data.result || [];
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ amId: string }> }
) {
  const { amId } = await params;
  const now = new Date();
  const sixMonths = new Date();
  sixMonths.setMonth(now.getMonth() + 6);

  const tenancies = await odooCall<Lease>(
    "property.tenancy",
    "search_read",
    [
      [
        ["date_end", "<=", sixMonths.toISOString().slice(0, 10)],
        ["date_end", ">=", now.toISOString().slice(0, 10)],
      ],
    ],
    ["id", "display_name", "date_end", "space", "current_rent", "main_property_id"]
  );

  if (!tenancies.length) return NextResponse.json([]);

  // map des property_id → sales_person_id
  const propertyIds = [
    ...new Set(
      tenancies
        .map((t) =>
          Array.isArray(t.main_property_id)
            ? t.main_property_id[0]
            : t.main_property_id
        )
        .filter(Boolean)
    ),
  ];

  if (propertyIds.length === 0) return NextResponse.json([]);

type Property = {
  id: number;
  sales_person_id: [number, string] | number | null;
};

const properties = await odooCall<Property>(
  "property.property",
  "search_read",
  [[["id", "in", propertyIds]]],
  ["id", "sales_person_id"]
);


  const propertyMap: Record<number, number | null> = {};
  for (const p of properties) {
    propertyMap[p.id] = Array.isArray(p.sales_person_id)
      ? p.sales_person_id[0]
      : p.sales_person_id;
  }

  const filtered = tenancies.filter((t) => {
    const propId = Array.isArray(t.main_property_id)
      ? t.main_property_id[0]
      : t.main_property_id;
    return propertyMap[propId] === parseInt(amId, 10);
  });

  return NextResponse.json(filtered);
}
