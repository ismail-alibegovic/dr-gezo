import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Poliklinika Dr. Gežo | ORL poliklinika u Sarajevu',description:'Specijalistički ORL pregledi, dijagnostika sluha i liječenje bolesti uha, nosa i grla. Dobrinja II i Otoka, Sarajevo.',robots:{index:false,follow:false},icons:{icon:'/favicon.png'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="bs"><body>{children}</body></html>}
