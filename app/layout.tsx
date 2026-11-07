import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Poliklinika Dr. Gežo — koncept početne stranice',description:'Nezavisni dizajnerski koncept za Polikliniku Dr. Gežo, Sarajevo.',robots:{index:false,follow:false}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="bs"><body>{children}</body></html>}
