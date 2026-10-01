import { mkdir } from "node:fs/promises";
import path from "node:path";
import { type Page, type TestInfo } from "@playwright/test";

const SCREENSHOT_DIR = path.join(process.cwd(), "screenshots");

export async function takeScreenshot(
  page: Page,
  name: string,
  testInfo: TestInfo,
) {
  await mkdir(SCREENSHOT_DIR, { recursive: true });

  const fileName = `${name.replace(/\s+/g, "-").toLowerCase()}.png`;
  const filePath = path.join(SCREENSHOT_DIR, fileName);

  const buffer = await page.screenshot({
    path: filePath,
    fullPage: true,
  });

  await testInfo.attach(name, {
    body: buffer,
    contentType: "image/png",
  });
}
