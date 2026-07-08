import React from "react";
import Link from "next/link";

export function LoginLink() {
  return (
    <div className="text-center mt-2">
      <p className="text-xs text-muted-foreground font-medium">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-purple-500 hover:text-purple-400 hover:underline transition-colors ml-1 font-semibold"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
