import { Admin, Resource, ListGuesser } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  useUser,
  useClerk,
} from "@clerk/clerk-react";

const frontendApi = process.env.REACT_APP_CLERK_FRONTEND_API;

const App = () => {
  return (
    <ClerkProvider frontendApi={frontendApi}>
      <SignedIn>
        <AdminWithClerk />
      </SignedIn>
      <SignedOut>
        {/* provide an after sign in so we stay in place after sign-in
         and React Admin loads */}
        <SignIn afterSignIn="/" />
      </SignedOut>
    </ClerkProvider>
  );
};

const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");
const AdminWithClerk = () => {
  const user = useUser();
  const { signOut } = useClerk();
  const authProvider = {
    checkError: (error) => {
      /* ... */
    },
    checkAuth: () => Promise.resolve(),
    logout: () => {
      signOut();
    },
    getIdentity: () => {
      try {
        return Promise.resolve({
          id: user.id,
          fullName: user.fullName,
          avatar: user.profileImageUrl,
        });
      } catch (error) {
        return Promise.reject(error);
      }
    },
    getPermissions: () => {
      // Instead, you can fetch() from your API to determine
      // the current users permissions, or put them on the
      // user's publicMetadata.
      return Promise.resolve("admin");
    },
    // ...
  };
  return (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
      <Resource name="users" list={ListGuesser} />
      <Resource name="todos" list={ListGuesser} />
    </Admin>
  );
};

export default App;
