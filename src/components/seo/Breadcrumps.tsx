'use client';

import Link from 'next/link';

type Crumb = { name: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
    return (
        <nav aria-label="Хлебные крошки" className="mb-4 text-sm">
            <ol className="flex flex-wrap items-center gap-2 text-white/80">
                {items.map((item, i) => {
                    const isLast = i === items.length - 1;
                    return (
                        <li key={i} className="flex items-center gap-2">
                            {item.href && !isLast ? (
                                <Link
                                    href={item.href}
                                    className="underline underline-offset-4 hover:text-yellow-300"
                                >
                                    {item.name}
                                </Link>
                            ) : (
                                <span className="text-white">{item.name}</span>
                            )}
                            {!isLast && <span className="opacity-60">/</span>}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
