// scripts/route-list.ts
import fs from "fs";
import path from "path";
import chalk from "chalk";

const appDir = path.join(process.cwd(), "src/app");

function getRoutes(dir: string, base = ""): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let routes: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const routePath = `${base}/${entry.name}`;

    // Skip folder khusus seperti (components) atau (lib)
    if (entry.isDirectory() && entry.name.startsWith("(") && entry.name.endsWith(")")) {
      routes = routes.concat(getRoutes(fullPath, base)); // lewati wrapper route
      continue;
    }

    if (entry.isDirectory()) {
      if (
        fs.existsSync(path.join(fullPath, "page.tsx")) ||
        fs.existsSync(path.join(fullPath, "page.js"))
      ) {
        routes.push(routePath.replace(/\/page$/, ""));
      }
      routes = routes.concat(getRoutes(fullPath, routePath));
    }
  }

  return routes;
}

console.log(chalk.bold.cyan("📍 Next.js Routes:\n"));

const routes = getRoutes(appDir)
  .map((r) =>
    r
      .replace(/\/page$/, "")
      .replace(/index$/, "")
      .replace(/\/$/, "")
      .replace(/^\/$/, "/")
  )
  .filter((v, i, a) => a.indexOf(v) === i) // hapus duplikat
  .sort((a, b) => a.localeCompare(b));

if (routes.length === 0) {
  console.log(chalk.yellow("⚠️  Tidak ada route ditemukan di src/app"));
} else {
  routes.forEach((route, i) => {
    const color =
      route === "/"
        ? chalk.greenBright
        : route.includes("[")
        ? chalk.magentaBright
        : chalk.cyanBright;
    console.log(chalk.gray(`${String(i + 1).padStart(2, "0")}. `) + color(route));
  });
}

console.log("\n✅ Selesai!\n");
