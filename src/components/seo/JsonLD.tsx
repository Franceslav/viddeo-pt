// src/components/seo/JsonLd.tsx
import React from "react";

type Props = { data: Record<string, unknown> };

export default function JsonLd({ data }: Props) {
    return (
        <script
            type="application/ld+json"
            // важно: без форматирования и с JSON.stringify
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
