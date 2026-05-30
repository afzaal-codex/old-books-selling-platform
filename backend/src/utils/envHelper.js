import fs from "fs";
import path from "path";

/**
 * Updates a specific key in the .env file with a new value.
 * @param {string} key - The environment variable key.
 * @param {string} value - The new value to set.
 */
export const updateEnvValue = (key, value) => {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (!fs.existsSync(envPath)) {
      console.warn(`.env file not found at ${envPath}`);
      return false;
    }

    let envContent = fs.readFileSync(envPath, "utf8");
    
    // Pattern to match key=value lines. Handles optional quotes around values.
    const regex = new RegExp(`^${key}=.*$`, "m");

    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      // If the key is not in the file, append it
      envContent += `\n${key}=${value}`;
    }

    fs.writeFileSync(envPath, envContent, "utf8");
    
    // Also update the currently running process environment
    process.env[key] = value;
    
    console.log(`Successfully updated ${key} in .env`);
    return true;
  } catch (error) {
    console.error(`Failed to update ${key} in .env:`, error.message);
    return false;
  }
};
