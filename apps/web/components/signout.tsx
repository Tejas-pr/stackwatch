import { signOut } from "@repo/auth/client";
import { Button } from "@repo/ui/components/button";

export default function SignOut () {

    const handleLogOut = async () => {
        await signOut();
    }

    return (
        <>
            <div>
                <Button className="hover:cursor-pointer" onClick={handleLogOut} variant="destructive">
                    Log out
                </Button>
            </div>
        </>
    )
}