import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import("tailwindcss").Config} */
export default {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}", "app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
    theme: {
        screens: {
            "2xs": "480px",
            xs: "480px",
            sm: "576px",
            md: "768px",
            lg: "992px",
            xl: "1240px",
            "2xl": "1540px",
            "3xl": "1640px",
        },
        extend: {
            fontFamily: {
                poppins: ["Poppins", "serif"],
                Inter: ["Inter", "serif"],
                ibm: ["IBM Plex Sans", "serif"],
                LobsterTwo: ["Lobster Two", "sans-serif"],
                Acme: ["Acme", "sans-serif"],
                Rajdhani: ["Rajdhani", "sans-serif"],
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    960: "hsl(var(--primary-960))",
                    950: "hsl(var(--primary-950))",
                    940: "hsl(var(--primary-940))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                    950: "hsl(var(--secondary-950))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                green: {
                    DEFAULT: "hsl(var(--green))",
                    950: "hsl(var(--green-950))",
                    940: "hsl(var(--green-940))",
                    930: "hsl(var(--green-930))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                light: {
                    950: "hsl(var(--light-950))",
                    900: "hsl(var(--light-900))",
                    850: "hsl(var(--light-850))",
                    830: "hsl(var(--light-830))",
                    800: "hsl(var(--light-800))",
                    790: "hsl(var(--light-790))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                dark: {
                    950: "hsl(var(--dark-950))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            backgroundImage: {
                "auth-gradient": "linear-gradient(90deg, hsla(200, 19%, 85%, 1.00) 0%, hsla(205, 6%, 62%, 1.00) 100%)",
            },
            boxShadow: {
                110: "2px 4px 4px 0px #03627217",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: {
                        height: "0",
                    },
                    to: {
                        height: "var(--radix-accordion-content-height)",
                    },
                },
                "accordion-up": {
                    from: {
                        height: "var(--radix-accordion-content-height)",
                    },
                    to: {
                        height: "0",
                    },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [tailwindcssAnimate],
};
