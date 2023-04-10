class XiaAppHeader {
    constructor(elementId, rootCookieName = 'xia_root_header_token', appCookieName = 'xia_app_header_token') {
        this.navbar = document.getElementById(elementId);
        this.navList = document.createElement('ul');
        this.navList.classList.add('navbar-nav', 'me-auto', 'mb-2', 'mb-lg-0');
        this.navbar.appendChild(this.navList);
        const root_cookie = Cookies.get(rootCookieName)
        const app_cookie = Cookies.get(appCookieName)
        this.root_header = root_cookie ? JSON.parse(atob(root_cookie)) : {}
        this.app_header = app_cookie ? JSON.parse(atob(app_cookie)) : {}
        this.app_name = this.getValue(this.app_header, 'app_name', '')
    }

    getValue(obj, key, defaultValue) {
        return key in obj ? obj[key] : defaultValue;
    }

    createLoginMenu() {
        this.createAppMenu()
        this.createRootMenu()
        this.createLoginStatusBar()
    }

    createSsoMenu() {
        this.createAppMenu()
        this.createRootMenu()
        this.createSsoStatusBar()
    }

    createAppMenu() {
        const login = this.getValue(this.root_header, 'login', false);

        if (login) {
            const app_menu = this.getValue(this.app_header, 'app_menu', {});
            const app_menu_mapping = this.getValue(app_menu, 'mapping', {});

            const dropdown = document.createElement('li');
            dropdown.classList.add('nav-item', 'dropdown');
            dropdown.id = 'navMenuBar';

            const dropdownMenu = document.createElement('ul');
            dropdownMenu.classList.add('dropdown-menu');

            const dropdownToggle = document.createElement('a');
            dropdownToggle.classList.add('nav-link', 'active', 'dropdown-toggle');
            dropdownToggle.href = '#';
            dropdownToggle.setAttribute('role', 'button');
            dropdownToggle.setAttribute('data-bs-toggle', 'dropdown');
            dropdownToggle.setAttribute('aria-current', 'page');
            dropdownToggle.setAttribute('aria-expanded', 'false');
            dropdownToggle.textContent = this.app_name;

            for (const key in app_menu_mapping) {
                const listItem = document.createElement('li');
                const linkItem = document.createElement('a');
                linkItem.href = app_menu_mapping[key];
                linkItem.textContent = key;
                linkItem.classList.add('dropdown-item');
                listItem.appendChild(linkItem);
                dropdownMenu.appendChild(listItem);
            }
            const divider = document.createElement('li');
            const hr = document.createElement('hr');
            hr.classList.add('dropdown-divider');
            divider.appendChild(hr);
            dropdownMenu.appendChild(divider);

            dropdown.appendChild(dropdownToggle);
            dropdown.appendChild(dropdownMenu);
            this.navList.appendChild(dropdown);
        }
    }

    createRootMenu() {
        const root_menu = this.getValue(this.root_header, 'root_menu', {});
        for (const key in root_menu) {
            if (key !== this.app_name) {
                let menu_item = this.getValue(root_menu, key, {});
                const listItem = document.createElement('li');
                listItem.classList.add('nav-item');

                const linkItem = document.createElement('a');
                linkItem.href = menu_item.url;
                linkItem.textContent = menu_item.title;
                linkItem.classList.add('nav-link');

                listItem.appendChild(linkItem);
                this.navList.appendChild(listItem);
            }
        }
    }

    createStatusPartition(dropdownMenu, status) {
        if (status) {
            for (const key in status) {
                const listItem = document.createElement('li');
                const linkItem = document.createElement('a');
                linkItem.href = '#';
                linkItem.textContent = status[key];
                linkItem.classList.add('dropdown-item');
                listItem.appendChild(linkItem);
                dropdownMenu.appendChild(listItem);
            }

            const divider = document.createElement('li');
            const hr = document.createElement('hr');
            hr.classList.add('dropdown-divider');
            divider.appendChild(hr);
            dropdownMenu.appendChild(divider);
        }
    }

    createLoginBar() {
        const loginLink = document.createElement('a');
        loginLink.href = '/accounts/login';
        loginLink.classList.add('btn', 'btn-outline-primary', 'my-2', 'my-sm-0', 'm-2');
        loginLink.setAttribute('role', 'button');
        loginLink.textContent = 'Login';

        const signUpLink = document.createElement('a');
        signUpLink.href = '/accounts/signup';
        signUpLink.classList.add('btn', 'btn-outline-secondary', 'my-2', 'my-sm-0');
        signUpLink.setAttribute('role', 'button');
        signUpLink.textContent = 'Sign Up';

        this.navbar.appendChild(loginLink);
        this.navbar.appendChild(signUpLink);
    }

    createSsoBar() {
        console.log("SSO Here")
        const dropdownDiv = document.createElement('div');
        dropdownDiv.classList.add('dropdown');

        const dropdownButton = document.createElement('button');
        dropdownButton.classList.add('btn', 'btn-outline-secondary', 'dropdown-toggle');
        dropdownButton.type = 'button';
        dropdownButton.id = 'xiaStatusDropdownMenuButton';
        dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
        dropdownButton.setAttribute('aria-expanded', 'false');
        dropdownButton.textContent = 'Login';

        const dropdownMenu = document.createElement('ul');
        dropdownMenu.classList.add('dropdown-menu');
        dropdownMenu.setAttribute('aria-labelledby', 'xiaStatusDropdownMenuButton');

        const dropdownItem = document.createElement('li');

        const imageLink = document.createElement('a');
        imageLink.href = '/sso/provider?state=';

        const image = document.createElement('img');
        image.src = '/static/images/logo.png';
        image.alt = 'SSO with X-I-A';
        image.style.width = '70px'; // Adjust the width as needed
        image.style.height = '61px'; // Adjust the height as needed

        imageLink.appendChild(image);
        dropdownItem.appendChild(imageLink);
        dropdownMenu.appendChild(dropdownItem);
        dropdownDiv.appendChild(dropdownButton);
        dropdownDiv.appendChild(dropdownMenu);
        this.navbar.appendChild(dropdownDiv);
    }

    createStatusBar(logoutPath) {
        const app_status = this.getValue(this.app_header, 'app_status', null)
        const root_status = this.getValue(this.root_header, 'menu_status', null)

        const dropdownDiv = document.createElement('div');
        dropdownDiv.classList.add('dropdown');

        const dropdownButton = document.createElement('button');
        dropdownButton.classList.add('btn', 'btn-outline-secondary', 'dropdown-toggle');
        dropdownButton.type = 'button';
        dropdownButton.id = 'xiaStatusDropdownMenuButton';
        dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
        dropdownButton.setAttribute('aria-expanded', 'false');
        dropdownButton.textContent = 'Account';

        const dropdownMenu = document.createElement('ul');
        dropdownMenu.classList.add('dropdown-menu');
        dropdownMenu.setAttribute('aria-labelledby', 'xiaStatusDropdownMenuButton');

        this.createStatusPartition(dropdownMenu, app_status);
        this.createStatusPartition(dropdownMenu, root_status);

        const logoutItem = document.createElement('li');
        logoutItem.classList.add('m-2');
        const logoutLink = document.createElement('a');
        logoutLink.href = '/' + logoutPath + '/logout';
        logoutLink.classList.add('btn', 'btn-outline-secondary', 'my-2', 'my-sm-0');
        logoutLink.setAttribute('role', 'button');
        logoutLink.textContent = 'Log Out';
        logoutItem.appendChild(logoutLink);
        dropdownMenu.appendChild(logoutItem);

        dropdownDiv.appendChild(dropdownButton);
        dropdownDiv.appendChild(dropdownMenu);
        this.navbar.appendChild(dropdownDiv);
    }

    createLoginStatusBar() {
        const login = this.getValue(this.root_header, 'login', false);

        if (login) {
            this.createStatusBar('accounts')
        } else {
            this.createLoginBar()
        }
    }

    createSsoStatusBar() {
        const login = this.getValue(this.root_header, 'login', false);

        if (login) {
            this.createStatusBar('sso')
        } else {
            this.createSsoBar()
        }
    }
}
