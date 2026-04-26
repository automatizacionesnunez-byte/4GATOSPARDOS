/**
 * 4 GATOS PARDOS - Scripts
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Sticky Navbar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active-menu');
        navToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active-menu');
            navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // 3. Scroll Reveal Animations
    const observerOptions = {
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .fadeInUp').forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Stats Counter Animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.getAttribute('data-target'));
                animateValue(target, 0, endValue, 2000);
                statsObserver.unobserve(target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stat-num').forEach(stat => {
        statsObserver.observe(stat);
    });

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // 5. WhatsApp Form Submission
    const whatsappForm = document.getElementById('whatsapp-form');
    
    if (whatsappForm) {
        whatsappForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const event = document.getElementById('event').value;
            const date = document.getElementById('date').value || 'No especificada';
            const message = document.getElementById('message').value || 'Sin mensaje adicional';
            
            const whatsappNumber = "34666606030";
            
            const text = `🎷 *Nueva Consulta de Contratación*%0A%0A` +
                         `👤 *Nombre:* ${name}%0A` +
                         `🎉 *Evento:* ${event}%0A` +
                         `📅 *Fecha:* ${date}%0A` +
                         `💬 *Mensaje:* ${message}`;
            
            const url = `https://wa.me/${whatsappNumber}?text=${text}`;
            
            window.open(url, '_blank');
        });
    }

    // 6. Band Member Switcher Logic
    const bandItems = document.querySelectorAll('.band-item');
    const featuredImg = document.getElementById('featured-img');
    const featuredName = document.getElementById('featured-name');
    const featuredRole = document.getElementById('featured-role');
    
    let currentBandIndex = 0;
    let bandInterval;
    let inactivityTimeout;

    const updateFeatured = (item, index) => {
        const name = item.getAttribute('data-name');
        const role = item.getAttribute('data-role');
        const img = item.getAttribute('data-img');
        const position = item.getAttribute('data-position') || 'center center';

        // Update index
        currentBandIndex = index;

        // Effect
        const card = document.getElementById('main-band-card');
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            featuredImg.src = img;
            featuredImg.style.objectPosition = position;
            featuredName.textContent = name;
            featuredRole.textContent = role;
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300);

        bandItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    };

    const nextMember = () => {
        let nextIndex = (currentBandIndex + 1) % bandItems.length;
        updateFeatured(bandItems[nextIndex], nextIndex);
    };

    const startBandAuto = () => {
        stopBandAuto();
        bandInterval = setInterval(nextMember, 5000);
    };

    const stopBandAuto = () => {
        clearInterval(bandInterval);
    };

    const resetInactivity = () => {
        stopBandAuto();
        clearTimeout(inactivityTimeout);
        inactivityTimeout = setTimeout(startBandAuto, 10000); // 10s inactivity to resume
    };

    bandItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            updateFeatured(item, index);
            resetInactivity();
        });
    });

    // Start on load
    startBandAuto();

    // 7. Smooth Scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 8. WhatsApp Chatbot Logic
    const waFab = document.getElementById('whatsapp-fab');
    const waModal = document.getElementById('wa-modal');
    const waClose = document.getElementById('wa-close');
    const waChatBody = document.getElementById('wa-chat-body');
    const waSendBtn = document.getElementById('wa-send-btn');
    const waCustomInput = document.getElementById('wa-custom-msg');
    
    const whatsappNumber = "34666606030";
    let currentStep = 0;
    const userData = { name: '', entity: '', purpose: '' };

    const addMessage = (text, type = 'received') => {
        const msg = document.createElement('div');
        msg.className = type === 'received' ? 'wa-msg-received' : 'wa-msg-sent';
        msg.textContent = text;
        waChatBody.appendChild(msg);
        waChatBody.scrollTop = waChatBody.scrollHeight;
    };

    const showBotMessage = (text) => {
        // Simple typing effect
        const typing = document.createElement('div');
        typing.className = 'wa-msg-received';
        typing.textContent = '...';
        waChatBody.appendChild(typing);
        waChatBody.scrollTop = waChatBody.scrollHeight;

        setTimeout(() => {
            waChatBody.removeChild(typing);
            addMessage(text, 'received');
        }, 1000);
    };

    const extractName = (input) => {
        let text = input.trim();
        // Remove common prefixes
        const prefixes = ["con ", "soy ", "me llamo ", "hola, soy ", "hola ", "buenas, soy ", "buenas "];
        let lowerText = text.toLowerCase();
        
        for (const prefix of prefixes) {
            if (lowerText.startsWith(prefix)) {
                text = text.slice(prefix.length).trim();
                break;
            }
        }
        
        // Capitalize first letter
        if (text.length > 0) {
            return text.charAt(0).toUpperCase() + text.slice(1);
        }
        return text;
    };

    const handleStep = () => {
        const input = waCustomInput.value.trim();
        if (!input) return;

        addMessage(input, 'sent');
        waCustomInput.value = '';

        if (currentStep === 0) {
            userData.name = extractName(input);
            currentStep = 1;
            showBotMessage(`¡Encantado de conocerte, ${userData.name}! ¿De parte de qué local, ayuntamiento o empresa nos escribes?`);
        } else if (currentStep === 1) {
            userData.entity = input;
            currentStep = 2;
            showBotMessage(`Perfecto. ¿En qué podemos ayudarte desde ${userData.entity}? (Presupuesto, disponibilidad, info general...)`);
        } else if (currentStep === 2) {
            userData.purpose = input;
            showBotMessage("¡Genial! Te redirijo ahora mismo a nuestro WhatsApp para concretar los detalles.");
            
            const finalMsg = `Hola! Soy ${userData.name} de ${userData.entity}. Me pongo en contacto con vosotros para: ${userData.purpose}`;
            
            setTimeout(() => {
                window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(finalMsg)}`, '_blank');
                waModal.classList.remove('active');
                // Reset for next time
                currentStep = 0;
                waChatBody.innerHTML = '';
            }, 1500);
        }
    };

    if (waFab) waFab.addEventListener('click', () => {
        if (!waModal.classList.contains('active')) {
            waModal.classList.add('active');
            if (waChatBody.children.length === 0) {
                showBotMessage("¡Hola! Soy el asistente de 4 Gatos Pardos. ¿Con quién tenemos el gusto de hablar?");
            }
        }
    });

    if (waClose) waClose.addEventListener('click', () => waModal.classList.remove('active'));

    if (waSendBtn) waSendBtn.addEventListener('click', handleStep);
    
    if (waCustomInput) {
        waCustomInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleStep();
        });
    }
    // 9. Video Thumbnail Fix & Reset on Play
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        const source = video.querySelector('source');
        if (source && source.src.includes('bogaloo')) {
            // Set thumbnail to 1s mark (the vinyl cover)
            video.addEventListener('loadedmetadata', () => {
                video.currentTime = 1;
            });
            // Play from 1s directly as requested
        }
    });

});
