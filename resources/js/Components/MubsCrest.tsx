import React from 'react';

export default function MubsCrest({ className = 'w-28 h-28' }: { className?: string }) {
    return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
            <svg
                viewBox="0 0 240 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-sm"
            >
                {/* Outer Circular Ring with Institutional Dark Slate / Navy border */}
                <circle cx="120" cy="120" r="114" fill="#ffffff" stroke="#2c3e50" strokeWidth="4" />
                <circle cx="120" cy="120" r="108" fill="#f8fafc" stroke="#1E5E8A" strokeWidth="1.5" />

                {/* Curved Text Path: MAKERERE UNIVERSITY BUSINESS SCHOOL */}
                <defs>
                    <path
                        id="crestTextArc"
                        d="M 28 120 A 92 92 0 1 1 212 120"
                        fill="none"
                    />
                </defs>
                <text
                    fontSize="10"
                    fontWeight="800"
                    fill="#1e293b"
                    letterSpacing="1.8"
                    className="select-none uppercase font-sans"
                >
                    <textPath href="#crestTextArc" startOffset="50%" textAnchor="middle">
                        MAKERERE UNIVERSITY BUSINESS SCHOOL
                    </textPath>
                </text>

                {/* Inner Shield & Arms Container */}
                <g transform="translate(120, 126)">
                    {/* Sunburst background rays behind shield */}
                    <g opacity="0.85">
                        {[-60, -45, -30, -15, 0, 15, 30, 45, 60].map((angle, i) => (
                            <line
                                key={i}
                                x1="0"
                                y1="-10"
                                x2={Math.sin((angle * Math.PI) / 180) * 45}
                                y2={-10 - Math.cos((angle * Math.PI) / 180) * 45}
                                stroke="#f59e0b"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        ))}
                    </g>

                    {/* Rising Golden Sun */}
                    <circle cx="0" cy="-12" r="14" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />

                    {/* Left Supporter: Uganda Kob / Antelope */}
                    <g transform="translate(-52, -18) scale(0.65)">
                        <path
                            d="M20 50 Q10 20 25 5 Q30 0 35 10 Q40 30 35 55 Q28 65 20 50 Z"
                            fill="#b45309"
                            stroke="#78350f"
                            strokeWidth="1.5"
                        />
                        {/* Horns */}
                        <path
                            d="M26 6 Q32 -18 20 -28 M30 8 Q38 -14 28 -24"
                            stroke="#451a03"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            fill="none"
                        />
                        {/* Legs */}
                        <path
                            d="M18 55 L14 85 M28 55 L30 85 M22 55 L24 82"
                            stroke="#78350f"
                            strokeWidth="2"
                        />
                    </g>

                    {/* Right Supporter: Uganda Kob / Antelope */}
                    <g transform="translate(52, -18) scale(-0.65, 0.65)">
                        <path
                            d="M20 50 Q10 20 25 5 Q30 0 35 10 Q40 30 35 55 Q28 65 20 50 Z"
                            fill="#b45309"
                            stroke="#78350f"
                            strokeWidth="1.5"
                        />
                        {/* Horns */}
                        <path
                            d="M26 6 Q32 -18 20 -28 M30 8 Q38 -14 28 -24"
                            stroke="#451a03"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            fill="none"
                        />
                        {/* Legs */}
                        <path
                            d="M18 55 L14 85 M28 55 L30 85 M22 55 L24 82"
                            stroke="#78350f"
                            strokeWidth="2"
                        />
                    </g>

                    {/* Central Heraldic Shield */}
                    <path
                        d="M -30 -14 L 30 -14 L 30 14 C 30 34, 0 46, 0 46 C 0 46, -30 34, -30 14 Z"
                        fill="#ffffff"
                        stroke="#1e293b"
                        strokeWidth="2"
                    />

                    {/* Shield Divisions: Red, Black, Gold & Blue Sections */}
                    {/* Top segment: Red chevron */}
                    <path
                        d="M -28 -12 L 28 -12 L 28 6 L 0 18 L -28 6 Z"
                        fill="#b91c1c"
                    />
                    {/* Lower segment: Sky / Royal Blue */}
                    <path
                        d="M -28 6 L 0 18 L 28 6 L 28 14 C 28 32, 0 43, 0 43 C 0 43, -28 32, -28 14 Z"
                        fill="#0284c7"
                    />

                    {/* Golden Sun & Open Book inside Shield */}
                    {/* Open Book */}
                    <g transform="translate(0, 0)">
                        <path
                            d="M -16 -6 C -8 -9, -4 -7, 0 -6 C 4 -7, 8 -9, 16 -6 L 15 8 C 8 5, 4 7, 0 8 C -4 7, -8 5, -15 8 Z"
                            fill="#fef08a"
                            stroke="#854d0e"
                            strokeWidth="1"
                        />
                        <line x1="0" y1="-6" x2="0" y2="8" stroke="#854d0e" strokeWidth="1" />
                        <line x1="-12" y1="-2" x2="-3" y2="-2" stroke="#a16207" strokeWidth="0.8" />
                        <line x1="-12" y1="2" x2="-3" y2="2" stroke="#a16207" strokeWidth="0.8" />
                        <line x1="3" y1="-2" x2="12" y2="-2" stroke="#a16207" strokeWidth="0.8" />
                        <line x1="3" y1="2" x2="12" y2="2" stroke="#a16207" strokeWidth="0.8" />
                    </g>

                    {/* Bottom Ribbon / Scroll: "ENABLING THE FUTURE" */}
                    <g transform="translate(0, 48)">
                        {/* Ribbon back folds */}
                        <path d="M -54 6 L -60 -2 L -48 0 Z" fill="#64748b" />
                        <path d="M 54 6 L 60 -2 L 48 0 Z" fill="#64748b" />

                        {/* Ribbon Banner */}
                        <path
                            d="M -52 8 C -30 2, 30 2, 52 8 L 48 -2 C 26 -7, -26 -7, -48 -2 Z"
                            fill="#ffffff"
                            stroke="#334155"
                            strokeWidth="1.2"
                        />
                        <text
                            x="0"
                            y="4.5"
                            textAnchor="middle"
                            fontSize="6"
                            fontWeight="800"
                            fill="#0f172a"
                            letterSpacing="0.8"
                            className="font-sans uppercase"
                        >
                            ENABLING THE FUTURE
                        </text>
                    </g>
                </g>
            </svg>
        </div>
    );
}
