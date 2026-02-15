import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      admin_role?: boolean | null;
      SMM_role?: boolean | null;
      designer_role?: boolean | null;
      videomaker_role?: boolean | null;
      photographer_role?: boolean | null;
      coordinator_role?: boolean | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    admin_role?: boolean | null;
    SMM_role?: boolean | null;
    designer_role?: boolean | null;
    videomaker_role?: boolean | null;
    photographer_role?: boolean | null;
    coordinator_role?: boolean | null;
  }
}
