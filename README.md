# linejs-android 🚀

**linejs-android** is a modified and enhanced version of the original [evex-dev/linejs](https://github.com/evex-dev/linejs) project.  
This project was developed to bring full compatibility and optimization for **Android environments**, while adding support for **Primary Token Authentication**, which was not fully implemented in the original repository.

---

## ✨ About This Project

`linejs-android` serves as a **Line Messaging API SDK** built with JavaScript/Node.js, optimized to run stably on Android-based systems (including Termux and Android WebView implementations).  
Additionally, it has been adapted to support **Primary Token Login**, allowing developers to authenticate directly with a primary token without the need for QR or password-based login.

The main goals of this project are to:

- 🔧 Provide a lightweight and faster SDK for Android environments.
- 🔒 Support authentication using _Primary Tokens_.
- ⚡ Simplify LINE API integration in Android-based Node.js applications.
- 📱 Enable automation, bots, and custom integrations with the LINE platform on mobile devices.

---

## 🧩 Key Features

✅ Full Android compatibility (Termux, Node.js Mobile, WebView)  
✅ Authentication via **Primary Token**  
✅ Full support for `FileStorage` and local Android storage  
✅ Optimized connection handling for mobile networks  
✅ Lightweight and modular architecture (same as original)  
✅ Suitable for automation, bot development, or custom API integrations

---

## 🧠 Usage Example

```bash
git clone https://github.com/fckveza/linejs-android.git
cd linejs-android
npm install
```

Import the modules as usual:

```js
import { BaseClient } from "./koncet/linejs/base/mod.js";
import { FileStorage } from "./koncet/linejs/base/storage/mod.js";
```

Example login using **Primary Token**:

```js
import { loginWithAuthToken } from "./mod.js";
import { FileStorage } from "./koncet/linejs/base/storage/mod.js";

const token = "u9f66afc5d1cafcca835f32552abae138:xxxxx";
const storage = new FileStorage("./storage");

const client = await loginWithAuthToken(token, { storage });
console.log("Successfully logged in as:", client.profile.displayName);
```

---

## 🔗 Original Source & Credits

This project is a **direct derivative** of [evex-dev/linejs](https://github.com/evex-dev/linejs), created by the **Evex Team**.  
All credits for the base structure, API logic, and documentation belong to them.  
The **linejs-android** project’s purpose is to extend compatibility and optimize performance for Android-based usage.

Contributions are welcome!  
If you have ideas, bug fixes, or platform extensions, feel free to open a pull request or start a discussion under _Issues_.

---

## ⚠️ Disclaimer

This project is intended for **educational and development purposes only**.  
Users are fully responsible for any use of tokens or personal data.  
Please use responsibly and in compliance with LINE Corporation’s official policies.

---

### 💬 Acknowledgment

Special thanks to **Evex Team** for the original repository.  
Without [evex-dev/linejs](https://github.com/evex-dev/linejs), the `linejs-android` project would not exist.
