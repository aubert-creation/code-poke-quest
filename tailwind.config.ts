import type { Config } from "tailwindcss";

const config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				pokemon: {
					red: '#ea384c',
					blue: '#1EAEDB',
					green: '#4EAD5B',
					yellow: '#FFC300',
					purple: '#9b87f5',
					cyan: '#0FA0CE',
					vscode: {
						bg: '#1A1F2C',
						panel: '#252B38',
					}
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pokemon-appear': {
					'0%': {
						transform: 'scale(0) rotate(0deg)',
						opacity: '0'
					},
					'60%': {
						transform: 'scale(1.2) rotate(5deg)',
					},
					'80%': {
						transform: 'scale(0.9) rotate(-5deg)',
					},
					'100%': {
						transform: 'scale(1) rotate(0deg)',
						opacity: '1'
					}
				},
				'pokemon-disappear': {
					'0%': {
						transform: 'scale(1) rotate(0deg)',
						opacity: '1'
					},
					'20%': {
						transform: 'scale(0.9) rotate(-5deg)',
					},
					'50%': {
						transform: 'scale(1.2) rotate(5deg)',
					},
					'100%': {
						transform: 'scale(0) rotate(0deg)',
						opacity: '0'
					}
				},
				'pokemon-evolution': {
					'0%': {
						filter: 'brightness(1)'
					},
					'25%': {
						filter: 'brightness(3)'
					},
					'50%': {
						filter: 'brightness(1)'
					},
					'75%': {
						filter: 'brightness(3)'
					},
					'100%': {
						filter: 'brightness(1)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'battle-shake': {
					'0%, 100%': {
						transform: 'translateX(0)'
					},
					'25%': {
						transform: 'translateX(-5px)'
					},
					'75%': {
						transform: 'translateX(5px)'
					}
				},
				'flash': {
					'0%, 50%, 100%': {
						opacity: '1'
					},
					'25%, 75%': {
						opacity: '0.5'
					}
				},
				"pokemon-shake": {
					"0%, 100%": { transform: "translateX(0)" },
					"25%": { transform: "translateX(-5px)" },
					"50%": { transform: "translateX(5px)" },
					"75%": { transform: "translateX(-5px)" }
				},
				"pokeball-throw": {
					"0%": { transform: "translateX(-200%) translateY(100%)" },
					"50%": { transform: "translateX(-100%) translateY(-100%)" },
					"100%": { transform: "translateX(0) translateY(0)" }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pokemon-appear': 'pokemon-appear 0.6s ease-out forwards',
				'pokemon-disappear': 'pokemon-disappear 0.6s ease-out forwards',
				'pokemon-evolution': 'pokemon-evolution 1.5s ease-in-out',
				'float': 'float 3s ease-in-out infinite',
				'battle-shake': 'battle-shake 0.3s ease-in-out 3',
				'flash': 'flash 0.5s ease-in-out',
				"pokemon-shake": "pokemon-shake 0.5s ease-in-out",
				"pokeball-throw": "pokeball-throw 0.8s ease-out forwards"
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};

export default config;
