import Image from "next/image";
import Link from "next/link";

const HomeNavbar = () => {
    return ( 
        <nav className="w-full bg-[#F3F8F2] p-5 flex justify-between items-center px-100 shadow-2xl">
          <div className="flex items-center gap-3">
            <Image src="/trello.png" width={50} height={50} alt="logo"/>
            <h1 className="font-bold md:text-3xl text-2xl">Trello</h1>
          </div>
          <div className="flex gap-10 items-center justify-center h-full">
            <Link href="/sign-in" className="hover:underline hover:text-black/70">Log in</Link>
            <Link href="/sign-up" className="hover:underline bg-[#3581B8] text-white px-5 py-2">Get Trello for free</Link>
          </div>
        </nav>
     );
}
 
export default HomeNavbar;