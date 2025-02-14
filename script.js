document.querySelectorAll('.grid-carousel-container').forEach(container => {
    const carousel = container.querySelector('.grid-carousel');
    const leftArrow = container.querySelector('.left-arrow');
    const rightArrow = container.querySelector('.right-arrow');

    let currentIndex = 0;
    let isTransitioning = false;

    const cloneCarouselItems = () => {
        const items = Array.from(carousel.children);
        items.forEach(item => {
            const clone = item.cloneNode(true);
            carousel.appendChild(clone);
        });
    };

    const updateCarousel = () => {
        const itemWidth = container.querySelector('.grid-item').offsetWidth + 20;
        const totalItems = container.querySelectorAll('.grid-item').length;

        const offset = currentIndex * itemWidth;
        carousel.style.transition = isTransitioning ? 'transform 0.5s ease-in-out' : 'none';
        carousel.style.transform = `translateX(-${offset}px)`;
    };

    const scrollRight = () => {
        const visibleItems = 6;
        const totalItems = container.querySelectorAll('.grid-item').length;

        if (!isTransitioning) {
            currentIndex++;
            isTransitioning = true;
            updateCarousel();

            if (currentIndex >= totalItems - visibleItems) {
                setTimeout(() => {
                    isTransitioning = false;
                    currentIndex = 0;
                    updateCarousel();
                }, 500);
            } else {
                setTimeout(() => {
                    isTransitioning = false;
                }, 500);
            }
        }
    };

    const scrollLeft = () => {
        const totalItems = container.querySelectorAll('.grid-item').length;

        if (!isTransitioning) {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = totalItems / 2 - 1;
            }

            isTransitioning = true;
            updateCarousel();

            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        }
    };

    leftArrow.addEventListener('click', scrollLeft);
    rightArrow.addEventListener('click', scrollRight);

    cloneCarouselItems();
    updateCarousel();

    setInterval(scrollRight, 5000);
});


// Initialisation
cloneCarouselItems();
updateCarousel();

window.addEventListener('scroll', () => {
    const footer = document.querySelector('.footer');
    const scrollPosition = window.scrollY + window.innerHeight;
    const contentHeight = document.body.offsetHeight;

    // Si le bas de la page est atteint
    if (scrollPosition >= contentHeight) {
        footer.classList.remove('scroll-effect'); // Affiche le footer
    } else {
        footer.classList.add('scroll-effect'); // Cache le footer
    }
});


<script>
document.getElementById('luxuryForm').addEventListener('submit', function (e) {
    // Prevent form submission
    e.preventDefault();

    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(function (span) {
        span.textContent = '';
    });

    // Collect form fields
    const firstName = document.getElementById('first-name');
    const lastName = document.getElementById('last-name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const message = document.getElementById('message');

    let isValid = true;

    // Validate fields
    if (!firstName.value.trim()) {
        isValid = false;
        document.getElementById('firstNameError').textContent = 'First name is required.';
    }

    if (!lastName.value.trim()) {
        isValid = false;
        document.getElementById('lastNameError').textContent = 'Last name is required.';
    }

    if (!email.value.trim() || !/\S+@\S+\.\S+/.test(email.value)) {
        isValid = false;
        document.getElementById('emailError').textContent = 'Please enter a valid email address.';
    }

    if (!phone.value.trim() || !/^\+?[0-9]{10,15}$/.test(phone.value)) {
        isValid = false;
        document.getElementById('phoneError').textContent = 'Please enter a valid phone number.';
    }

    if (!message.value.trim()) {
        isValid = false;
        document.getElementById('messageError').textContent = 'Message is required.';
    }

    // If all fields are valid, allow submission (for demo purposes, just alert success)
    if (isValid) {
        alert('Form submitted successfully!');
        // Uncomment the next line to allow real submission
        // this.submit();
    }
    document.querySelector('.menu-icon').addEventListener('click', function () {
        const menu = document.querySelector('.dropdown-menu');
        menu.classList.toggle('active');
    });
    

    document.querySelector('.footer-menu-icon').addEventListener('click', function () {
        const footerMenu = document.getElementById('footerMobileMenu');
        footerMenu.classList.toggle('active');
    });
    // Sélection des éléments
const menuIcon = document.querySelector('.menu-icon');
const dropdownMenu = document.querySelector('.dropdown-menu');

// Ajouter un événement au clic sur l'icône
menuIcon.addEventListener('click', () => {
    dropdownMenu.classList.toggle('active'); // Ajoute ou enlève la classe active
});

function toggleFooterMenu() {
    const footerMenu = document.getElementById('footerMobileMenu');
    footerMenu.classList.toggle('active'); // Ajoute ou retire la classe active
}


