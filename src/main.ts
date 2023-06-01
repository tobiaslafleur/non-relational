import { buildServer } from "@/utils/server";

async function main() {
  const server = await buildServer();

  server.listen(
    {
      port: 3000,
    },
    function () {
      console.log("Server is running on http://localhost:3000");
    }
  );
}

main();
