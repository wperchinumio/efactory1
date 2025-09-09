/** @type {import('tailwindcss').Config} */

module.exports = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // safelist: [
  //   // Common padding classes for development/debugging
  //   'pl-10', 'pr-10', 'pt-10', 'pb-10', 'px-10', 'py-10',
  //   'pl-11', 'pr-11', 'pt-11', 'pb-11', 'px-11', 'py-11',
  //   'pl-12', 'pr-12', 'pt-12', 'pb-12', 'px-12', 'py-12',
  // ],
  theme: {
  	extend: {
  		fontFamily: {
  			'base': 'var(--font-family)'
  		},
  		fontSize: {
  			'base': [
  				'16px',
  				'24px'
  			]
  		},
  		boxShadow: {
  			'shadow-sm': 'var(--shadow-sm)',
  			'shadow-normal': 'var(--shadow-normal)',
  			'shadow-lg': 'var(--shadow-lg)'
  		},
  		colors: {
  			'theme-indigo': 'var(--theme-indigo)',
  			'theme-blue': 'var(--theme-blue)',
  			'theme-cyan': 'var(--theme-cyan)',
  			'theme-green': 'var(--theme-green)',
  			'theme-orange': 'var(--theme-orange)',
  			'theme-blush': 'var(--theme-blush)',
  			'theme-red': 'var(--theme-red)',
  			'white': 'var(--white)',
  			'white-10': 'var(--white-10)',
  			'black': 'var(--black)',
  			'black-50': 'var(--black-50)',
  			'dark': 'var(--dark)',
  			'grey': 'var(--grey)',
  			'success': 'var(--success)',
  			'success-50': 'var(--success-50)',
  			'warning': 'var(--warning)',
  			'info': 'var(--info)',
  			'danger': 'var(--danger)',
  			'sky': 'var(--sky)',
  			'blue': 'var(--blue)',
  			'body-color': 'var(--body-color)',
  			'font-color': 'var(--font-color)',
  			'font-color-100': 'var(--font-color-100)',
  			'font-color-200': 'var(--font-color-200)',
  			'font-color-400': 'var(--font-color-400)',
  			'card-color': 'var(--card-color)',
  			'border-color': 'var(--border-color)',
  			'primary': 'var(--primary)',
  			'primary-10': 'var(--primary-10)',
  			'secondary': 'var(--secondary)',
  			'chart-color1': 'var(--chart-color1)',
  			'chart-color2': 'var(--chart-color2)',
  			'chart-color3': 'var(--chart-color3)',
  			'chart-color4': 'var(--chart-color4)',
  			'chart-color5': 'var(--chart-color5)',
  			'chart1': 'var(--chart-color1)',
  			'chart2': 'var(--chart-color2)',
  			'chart3': 'var(--chart-color3)',
  			'chart4': 'var(--chart-color4)',
  			'chart5': 'var(--chart-color5)',
  			/*background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}*/
  		},
  		screens: {
  			ssm: '375px',
  			sm: '640px',
  			md: '768px',
  			lg: '1024px',
  			xl: '1200px',
  			xxl: '1440px'
  		},
  		container: {
  			center: true,
  			padding: '12px',
  			screens: {
  				ssm: '375px',
  				sm: '640px',
  				md: '768px',
  				lg: '1024px',
  				xl: '1200px',
  				xxl: '1320px'
  			}
  		}/*,
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}*/
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

