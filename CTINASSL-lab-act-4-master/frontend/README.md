# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

// LOGIN AND REGISTER is working

Last Updated Tue Feb 4 9:22PM

notes
all working except the ones who logged in isnt getting authorized
has middleware requireAuth.js
and calling it in product.route.js to protect the routes

// possible issue is the user who logged in couldnt get the token or something that is why
the user isnt getting authorized to view the pages after logged in
