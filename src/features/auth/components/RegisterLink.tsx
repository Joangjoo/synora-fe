import React from "react";
import Link from "next/link";

export function RegisterLink() {
  return (
    <div className="text-center mt-2">
      <p className="text-xs text-muted-foreground font-medium">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-purple-500 hover:text-purple-400 hover:underline transition-colors ml-1 font-semibold"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
