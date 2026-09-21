import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user) {
          throw new Error("No account found with that email. Please sign up first.");
        }

        // Support both bcrypt hashes and legacy plaintext passwords
        let passwordValid = false;
        if (user.password.startsWith("$2")) {
          // bcrypt hash
          passwordValid = await bcrypt.compare(credentials.password, user.password);
        } else {
          // legacy plaintext — compare directly, then upgrade to hash
          passwordValid = user.password === credentials.password;
          if (passwordValid) {
            const hashed = await bcrypt.hash(credentials.password, 12);
            await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
          }
        }

        if (!passwordValid) {
          throw new Error("Incorrect password. Please try again.");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id ?? token.sub;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "finaccess-secret-key-123456",
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
};
