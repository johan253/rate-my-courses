import Button from "@/components/Button";
import { useRouter, usePathname } from "next/navigation";

function AuthModal({ isOpen, message } : { isOpen: boolean, message: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const redirectToSignin = () => {
    router.push(`/api/auth/signin?callbackUrl=${pathname}`);
  };
  return (
    <>
      {isOpen && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 rounded-lg">
          <div className="bg-white rounded-lg p-8 max-w-sm mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
            <p className="mb-6">{message}</p>
            <Button onClick={redirectToSignin} variant="primary">
              Sign In
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default AuthModal;