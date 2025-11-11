import { Header } from "../_components/header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../_components/ui/tabs";

import SignInForm from "./_components/sign-in-form";
import SignUpForm from "./_components/sign-up-form";

const Authentication = async () => {
  return (
    <>
      <Header logoOnly />

      <div className="flex w-full flex-col items-center gap-6 p-5">
        <Tabs defaultValue="sign-in" className="w-full max-w-md">
          <TabsList className="w-full">
            <TabsTrigger value="sign-in" className="w-full">
              Entrar
            </TabsTrigger>
            <TabsTrigger value="sign-up" className="w-full">
              Criar conta
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in" className="w-full">
            <SignInForm />
          </TabsContent>
          <TabsContent value="sign-up" className="w-full">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Authentication;
