/**
 * MOCK FIXTURES — NOT REAL DATA, AND NOT CONTENT.
 *
 * Account rows as the admin user list would show them.
 *
 * Nobody can sign in: there is no auth in this stage, and these rows exist so
 * the screen can be looked at. The roles are the two `docs/scope.md` names,
 * client and admin, and nothing here grants anything.
 */

export type MockUser = {
  id: string;
  name: string;
  email: string;
  role: "Client" | "Admin";
  /** Empty for staff, who belong to no client company. */
  companyId: string | null;
  joinedOn: string;
};

export const MOCK_USERS: readonly MockUser[] = [
  {
    id: "mock-us-2041",
    name: "Alex Rivera",
    email: "alex@example.com",
    role: "Client",
    companyId: "mock-co-northbrook",
    joinedOn: "12 September 2026",
  },
  {
    id: "mock-us-2038",
    name: "Morgan Diallo",
    email: "morgan@example.com",
    role: "Client",
    companyId: "mock-co-harbourline",
    joinedOn: "21 August 2026",
  },
  {
    id: "mock-us-2033",
    name: "Jamie Lindqvist",
    email: "jamie@example.com",
    role: "Client",
    companyId: "mock-co-brightfold",
    joinedOn: "19 May 2026",
  },
  {
    id: "mock-us-2029",
    name: "Riley Nakamura",
    email: "riley@example.com",
    role: "Client",
    companyId: "mock-co-cedarpoint",
    joinedOn: "9 September 2026",
  },
  {
    id: "mock-us-1004",
    name: "Dana Whitfield",
    email: "dana@example.com",
    role: "Admin",
    companyId: null,
    joinedOn: "4 January 2026",
  },
  {
    id: "mock-us-1002",
    name: "Priya Raman",
    email: "priya@example.com",
    role: "Admin",
    companyId: null,
    joinedOn: "4 January 2026",
  },
  {
    id: "mock-us-1001",
    name: "Sam Okonkwo",
    email: "sam@example.com",
    role: "Admin",
    companyId: null,
    joinedOn: "4 January 2026",
  },
];

export function mockUserById(id: string): MockUser | undefined {
  return MOCK_USERS.find((user) => user.id === id);
}
