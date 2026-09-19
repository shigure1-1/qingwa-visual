"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export type FooterGroup = {
  label: string;
  englishLabel: string;
  href: string;
  children: Array<{ label: string; href: string }>;
};

type FooterBusinessNavProps = {
  groups: FooterGroup[];
};

function getGroupId(href: string) {
  return `footer-nav-${href.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}`;
}

export function FooterBusinessNav({ groups }: FooterBusinessNavProps) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const columns = groups.reduce<FooterGroup[][]>((result, group, index) => {
    result[index % 2].push(group);
    return result;
  }, [[], []]);

  return (
    <nav className="footer-business-nav" aria-label="页脚业务导航">
      <div className="footer-business-columns">
        {columns.map((column, columnIndex) => (
          <div className="footer-business-column" key={`footer-column-${columnIndex}`}>
            {column.map((group) => {
              const groupIndex = groups.indexOf(group);
              const hasChildren = group.children.length > 0;
              const groupId = getGroupId(group.href);
              const isExpanded = expandedGroup === group.href;

              return (
                <div
                  className="footer-nav-group"
                  data-expanded={isExpanded}
                  data-has-children={hasChildren}
                  data-index={groupIndex}
                  key={group.href}
                >
                  <div className="footer-nav-title-row">
                    <Link className="footer-nav-title" href={group.href}>
                      <strong>{group.label}</strong>
                      <span>{group.englishLabel}</span>
                    </Link>
                    {hasChildren && (
                      <button
                        className="footer-nav-toggle"
                        type="button"
                        aria-controls={groupId}
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? "收起" : "展开"}${group.label}子业务`}
                        onClick={() => setExpandedGroup(isExpanded ? null : group.href)}
                      >
                        <ChevronDown aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  {hasChildren && (
                    <div className="footer-nav-group-items">
                      <ul id={groupId}>
                        {group.children.map((child) => (
                          <li key={child.href}>
                            <Link href={child.href}>{child.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </nav>
  );
}
