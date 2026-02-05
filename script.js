// Обратный отсчет до свадьбы 24 апреля 2026 года, 15:30
const weddingDate = new Date('2026-04-24T15:30:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = weddingDate - now;
    
    if (timeLeft < 0) {
        document.getElementById('weeks').textContent = '00';
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }
    
    const seconds = Math.floor((timeLeft / 1000) % 60);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const days = Math.floor((timeLeft / (1000 * 60 * 60 * 24)) % 7);
    const weeks = Math.floor(timeLeft / (1000 * 60 * 60 * 24 * 7));
    
    document.getElementById('weeks').textContent = weeks.toString().padStart(2, '0');
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Запуск обратного отсчета
updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);

// Настройка после загрузки
window.addEventListener('load', function() {

    document.body.classList.add('zero-visible');
    // Проверка фонового изображения (без уведомлений)
    const bgImg = new Image();
    bgImg.src = '11.jpg';
    
    bgImg.onerror = function() {
        // Если фон не загрузился, используем простой цветной фон
        document.body.style.backgroundColor = '#f5f5f5';
        
        // Также удаляем псевдоэлементы с фоном
        const style = document.createElement('style');
        style.textContent = `
            body::before,
            body::after,
            .schedule-section::before,
            .schedule-section::after {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    };
    
    // Проверка фото пары
    const photo = document.querySelector('.couple-photo');
    if (photo) {
        photo.onerror = function() {
            const container = document.querySelector('.photo-container');
            if (container) {
                container.innerHTML = '<div class="photo-placeholder" style="width: 280px; height: 200px; background: rgba(245, 245, 245, 0.9); display: flex; align-items: center; justify-content: center; color: #999; font-size: 14px; border-radius: 2px;">Фото Вадима и Марии</div>';
            }
        };
    }
    
    // ЗАКОММЕНТИРОВАНО: Настраиваем вертикальную линию
    // adjustVerticalLine();
    
    // ЗАКОММЕНТИРОВАНО: Корректируем при изменении размера
    // window.addEventListener('resize', adjustVerticalLine);
});

// ЗАКОММЕНТИРОВАНА функция настройки вертикальной линии
/*
// Настройка вертикальной линии - она должна доходить до блока "недели"
function adjustVerticalLine() {
    const verticalLine = document.querySelector('.vertical-line');
    const heroSection = document.querySelector('.hero');
    const countdownWrapper = document.querySelector('.countdown-wrapper');
    
    if (verticalLine && heroSection && countdownWrapper) {
        // Высота линии = высота всей секции минус (отступ счетчика снизу + высота счетчика)
        const heroHeight = heroSection.offsetHeight;
        const countdownBottom = parseInt(window.getComputedStyle(countdownWrapper).bottom);
        const countdownHeight = countdownWrapper.offsetHeight;
        
        // Высота линии: от верха даты до верха счетчика
        // Более простой подход: линия занимает почти всю высоту
        verticalLine.style.height = 'calc(100vh - 120px)';
    }
}
*/

// Отключение масштабирования
document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Предотвращение контекстного меню
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});


// Обработка кнопки подтверждения
// document.addEventListener('DOMContentLoaded', function() {
//     const confirmButton = document.querySelector('.confirm-button');
    
//     if (confirmButton) {
//         confirmButton.addEventListener('click', function() {
//             // Временное сообщение - позже можно заменить на форму подтверждения
//             alert('Функция подтверждения будет доступна позже. Спасибо за понимание!');
//         });
//     }
// });

// Улучшение взаимодействия с Яндекс картой на мобильных устройствах
document.addEventListener('DOMContentLoaded', function() {
    const mapIframe = document.querySelector('.map-wrapper iframe');
    const mapContainer = document.querySelector('.map-wrapper');
    const body = document.body;
    
    if (mapIframe && mapContainer) {
        let isTouchingMap = false;
        let startY = 0;
        
        // Для десктопов - просто разрешаем взаимодействие
        if (window.innerWidth > 768) {
            mapIframe.style.pointerEvents = 'auto';
            return;
        }
        
        // Для мобильных устройств - улучшенная обработка
        mapContainer.addEventListener('touchstart', function(e) {
            // Проверяем, началось ли касание на карте
            const rect = mapContainer.getBoundingClientRect();
            const touchY = e.touches[0].clientY;
            
            if (touchY >= rect.top && touchY <= rect.bottom) {
                isTouchingMap = true;
                startY = touchY;
                
                // Временно блокируем скролл страницы
                body.classList.add('map-scroll-lock');
                body.style.overflow = 'hidden';
                
                // Разрешаем взаимодействие с картой
                mapIframe.style.pointerEvents = 'auto';
            }
        }, { passive: true });
        
        mapContainer.addEventListener('touchmove', function(e) {
            if (!isTouchingMap) return;
            
            const currentY = e.touches[0].clientY;
            const deltaY = Math.abs(currentY - startY);
            
            // Если движение преимущественно вертикальное и значительное - это скролл страницы
            if (deltaY > 10) {
                // Восстанавливаем скролл страницы
                body.classList.remove('map-scroll-lock');
                body.style.overflow = 'auto';
                mapIframe.style.pointerEvents = 'none';
                isTouchingMap = false;
            }
        }, { passive: true });
        
        mapContainer.addEventListener('touchend', function() {
            // Восстанавливаем состояние
            setTimeout(() => {
                body.classList.remove('map-scroll-lock');
                body.style.overflow = 'auto';
                mapIframe.style.pointerEvents = 'auto';
                isTouchingMap = false;
            }, 100);
        }, { passive: true });
        
        // Обработка ухода курсора/пальца с карты
        mapContainer.addEventListener('mouseleave', function() {
            body.classList.remove('map-scroll-lock');
            body.style.overflow = 'auto';
        });
    }
});

// Также обновим обработку отключения масштабирования для страницы
document.addEventListener('touchstart', function(event) {
    // Разрешаем мультитач только для карты
    const isMapArea = event.target.closest('.map-wrapper');
    if (event.touches.length > 1 && !isMapArea) {
        event.preventDefault();
    }
}, { passive: false });

// Функционал модального окна подтверждения
document.addEventListener('DOMContentLoaded', function() {
    const confirmButton = document.querySelector('.confirm-button');
    const modalOverlay = document.getElementById('confirmationModal');
    const modalClose = document.querySelector('.modal-close');
    const closeModalBtn = document.getElementById('closeModal');
    
    // Элементы шагов
    const steps = document.querySelectorAll('.modal-step');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const step4 = document.getElementById('step4');
    const step5 = document.getElementById('step5');
    const step6 = document.getElementById('step6');
    const successStep = document.getElementById('successStep');
    
    // Кнопки навигации
    const nextToStep2 = document.getElementById('nextToStep2');
    const backToStep1 = document.getElementById('backToStep1');
    const nextToStep3 = document.getElementById('nextToStep3');
    const backToStep2 = document.getElementById('backToStep2');
    const nextToStep4 = document.getElementById('nextToStep4');
    const backToStep3 = document.getElementById('backToStep3');
    const nextToStep5 = document.getElementById('nextToStep5');
    const backToStep4 = document.getElementById('backToStep4');
    const nextToStep6 = document.getElementById('nextToStep6');
    const backToStep5 = document.getElementById('backToStep5');
    const submitBtn = document.getElementById('submitConfirmation');
    const hotelInfoCheckbox = document.getElementById('hotelInfo');
    
    // Поля формы
    const lastNameInput = document.getElementById('lastName');
    const firstNameInput = document.getElementById('firstName');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    
    // Переменные для управления положением модального окна
    let isKeyboardVisible = false;
    let originalModalPosition = 0;
    
    // Функция для корректировки положения модального окна
    function adjustModalPosition() {
        if (!isKeyboardVisible) return;
        
        const modalContainer = document.querySelector('.modal-container');
        if (!modalContainer) return;
        
        // Получаем активный инпут
        const activeInput = document.activeElement;
        if (!activeInput || !['INPUT', 'TEXTAREA'].includes(activeInput.tagName)) return;
        
        // Получаем позицию инпута относительно окна
        const inputRect = activeInput.getBoundingClientRect();
        const modalRect = modalContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Если инпут находится под клавиатурой
        if (inputRect.bottom > windowHeight / 2) {
            // Сдвигаем модальное окно вверх
            const offset = inputRect.bottom - (windowHeight / 2) + 50;
            modalContainer.style.transform = `translateY(-${offset}px)`;
        }
    }
    
    // Обработка появления/скрытия клавиатуры
    function handleKeyboardVisibility(visible) {
        isKeyboardVisible = visible;
        const modalContainer = document.querySelector('.modal-container');
        
        if (visible) {
            // Сохраняем исходную позицию
            originalModalPosition = modalContainer.style.transform || 'translateY(0)';
            
            // Даем небольшую задержку для появления клавиатуры
            setTimeout(adjustModalPosition, 100);
            
            // Также подписываемся на событие прокрутки
            modalContainer.addEventListener('scroll', adjustModalPosition);
        } else {
            // Возвращаем исходную позицию
            modalContainer.style.transform = originalModalPosition;
            
            // Убираем обработчик прокрутки
            modalContainer.removeEventListener('scroll', adjustModalPosition);
            
            // Сбрасываем фокус с инпута если нужно
            if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                document.activeElement.blur();
            }
        }
    }
    
    // Определяем появление/скрытие клавиатуры через изменение размера окна
    let previousWindowHeight = window.innerHeight;
    
    window.addEventListener('resize', function() {
        const currentHeight = window.innerHeight;
        
        // Если высота окна уменьшилась более чем на 150px - появилась клавиатура
        if (currentHeight < previousWindowHeight - 150) {
            handleKeyboardVisibility(true);
        }
        // Если высота окна восстановилась - клавиатура скрылась
        else if (currentHeight > previousWindowHeight + 100) {
            handleKeyboardVisibility(false);
        }
        
        previousWindowHeight = currentHeight;
    });
    
    // Также отслеживаем фокус на полях ввода
    phoneInput.addEventListener('focus', function() {
        // Фокусируем на элементе и прокручиваем к нему
        setTimeout(() => {
            this.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            adjustModalPosition();
        }, 300);
    });
    
    messageInput.addEventListener('focus', function() {
        setTimeout(() => {
            this.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            adjustModalPosition();
        }, 300);
    });
    
    // При закрытии модального окна сбрасываем все трансформации
    function resetModalPosition() {
        const modalContainer = document.querySelector('.modal-container');
        if (modalContainer) {
            modalContainer.style.transform = 'translateY(0)';
            modalContainer.removeEventListener('scroll', adjustModalPosition);
        }
        isKeyboardVisible = false;
    }
    
    // Маска для телефона
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value[0] === '7' || value[0] === '8') {
                value = value.substring(1);
            }
            
            let formattedValue = '+7';
            if (value.length > 0) {
                formattedValue += ' (' + value.substring(0, 3);
            }
            if (value.length >= 4) {
                formattedValue += ') ' + value.substring(3, 6);
            }
            if (value.length >= 7) {
                formattedValue += '-' + value.substring(6, 8);
            }
            if (value.length >= 9) {
                formattedValue += '-' + value.substring(8, 10);
            }
            
            e.target.value = formattedValue;
        }
    });
    
    // Функция переключения шагов
    function showStep(stepToShow) {
        steps.forEach(step => {
            step.classList.remove('active');
        });
        stepToShow.classList.add('active');
        
        // Прокручиваем к верхней части модального окна при смене шага
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
        
        // Сбрасываем позицию при смене шага
        resetModalPosition();
    }
    
    // Валидация шага 1
    function validateStep1() {
        return lastNameInput.value.trim() !== '' && firstNameInput.value.trim() !== '';
    }
    
    // Валидация шага 2
    function validateStep2() {
        const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        return phoneRegex.test(phoneInput.value);
    }
    
    // Валидация шага 6
    function validateStep6() {
        return hotelInfoCheckbox.checked;
    }
    
    // Обработчики кнопок навигации
    nextToStep2.addEventListener('click', function() {
        if (validateStep1()) {
            showStep(step2);
        } else {
            alert('Пожалуйста, заполните фамилию и имя');
        }
    });
    
    backToStep1.addEventListener('click', function() {
        showStep(step1);
    });
    
    nextToStep3.addEventListener('click', function() {
        if (validateStep2()) {
            showStep(step3);
        } else {
            alert('Пожалуйста, введите корректный номер телефона');
        }
    });
    
    backToStep2.addEventListener('click', function() {
        showStep(step2);
    });
    
    nextToStep4.addEventListener('click', function() {
        showStep(step4);
    });
    
    backToStep3.addEventListener('click', function() {
        showStep(step3);
    });
    
    nextToStep5.addEventListener('click', function() {
        showStep(step5);
    });
    
    backToStep4.addEventListener('click', function() {
        showStep(step4);
    });
    
    nextToStep6.addEventListener('click', function() {
        showStep(step6);
    });
    
    backToStep5.addEventListener('click', function() {
        showStep(step5);
    });
    
    // Отслеживание изменения чекбокса
    hotelInfoCheckbox.addEventListener('change', function() {
        submitBtn.disabled = !this.checked;
    });
    
    // Отправка формы
    submitBtn.addEventListener('click', function() {
        if (validateStep6()) {
            // Сбор данных формы
            const formData = {
                lastName: lastNameInput.value.trim(),
                firstName: firstNameInput.value.trim(),
                phone: phoneInput.value,
                food: document.querySelector('input[name="food"]:checked').value,
                alcohol: document.querySelector('input[name="alcohol"]:checked').value,
                hotel: document.querySelector('input[name="hotel"]:checked').value,
                hotelInfo: hotelInfoCheckbox.checked,
                message: messageInput.value.trim()
            };
            
            // Отправляем данные на сервер (Apps Script)
            const scriptUrl = 'https://script.google.com/macros/s/AKfycbx9f8YA8RBDU-Xr94AYGs3LpWjiIN7bcgKCuUGX8hKpnhTwWgucRmo7pw4p7zrAdtknmg/exec'; // Замените на ваш URL
            
            // Показываем индикатор загрузки
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
            
            // Отправка данных на сервер
            fetch(scriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Показать экран успеха
                    showStep(successStep);
                    
                    // Обновляем сообщение успеха
                    const successMessage = document.querySelector('#successStep p:first-of-type');
                    if (successMessage && data.guestName) {
                        successMessage.textContent = `Спасибо, ${data.guestName}! Подтверждение отправлено!`;
                    }
                } else {
                    alert('Ошибка при отправке данных: ' + data.message);
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Отправить подтверждение';
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Ошибка соединения. Проверьте интернет и попробуйте снова.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Отправить подтверждение';
            });
        }
    });
    
    // Закрытие модального окна
    function closeModal() {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetModalPosition();
    }
    
    modalClose.addEventListener('click', closeModal);
    closeModalBtn.addEventListener('click', closeModal);
    
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Открытие модального окна при клике на кнопку "Подтвердить"
    confirmButton.addEventListener('click', function() {
        // Сброс формы
        steps.forEach(step => step.classList.remove('active'));
        step1.classList.add('active');
        lastNameInput.value = '';
        firstNameInput.value = '';
        phoneInput.value = '';
        messageInput.value = '';
        hotelInfoCheckbox.checked = false;
        submitBtn.disabled = true;
        
        // Показать модальное окно
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Установить фокус на первое поле
        setTimeout(() => {
            lastNameInput.focus();
        }, 300);
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.style.display === 'flex') {
            closeModal();
        }
    });
    
    // Предотвращаем прокрутку страницы при открытом модальном окне
    modalOverlay.addEventListener('touchmove', function(e) {
        if (modalOverlay.style.display === 'flex') {
            e.preventDefault();
        }
    }, { passive: false });
});

// Предотвращение прыжков контента на мобильных
if ('visualViewport' in window) {
    const updateViewportHeight = () => {
        document.documentElement.style.setProperty(
            '--svh', 
            `${window.visualViewport.height * 0.01}px`
        );
    };
    
    updateViewportHeight();
    window.visualViewport.addEventListener('resize', updateViewportHeight);
    window.visualViewport.addEventListener('scroll', updateViewportHeight);
}

// Управление zero-секцией и музыкой - УПРОЩЕННАЯ ВЕРСИЯ
document.addEventListener('DOMContentLoaded', function() {
    const zeroSection = document.getElementById('zero-section');
    const startButton = document.getElementById('start-button');
    const weddingMusic = document.getElementById('wedding-music');
    
    // УДАЛЯЕМ проверку localStorage - секция всегда показывается при загрузке
    // zero-секция всегда видна при открытии сайта
    
    // Устанавливаем громкость музыки
    if (weddingMusic) {
        weddingMusic.volume = 0.7; // 70% громкости
    }
    
    // Восстанавливаем состояние музыки если она уже играла
    // if (weddingMusic && localStorage.getItem('musicPlaying') === 'true') {
    //     const savedTime = localStorage.getItem('musicTime');
    //     if (savedTime) {
    //         weddingMusic.currentTime = parseFloat(savedTime);
    //     }
    // }
    
    // Обработка нажатия кнопки
    if (startButton) {
        startButton.addEventListener('click', function(e) {
            e.stopPropagation(); // Останавливаем всплытие
            
            // Плавное скрытие zero-секции
            if (zeroSection) {
                zeroSection.classList.add('hidden');
            }

                    // Добавляем класс к body, чтобы начать анимацию hero-секции
            document.body.classList.remove('zero-visible');
            
            // УДАЛЯЕМ сохранение в localStorage - всегда показывать при загрузке
            // localStorage.setItem('zeroSectionClosed', 'true');
            
            // Включаем музыку ПОСЛЕ нажатия кнопки
            if (weddingMusic) {
                weddingMusic.play().then(() => {
                    console.log("Музыка включена по нажатию кнопки");
                    // Сохраняем, что музыка включена
                    //localStorage.setItem('musicPlaying', 'true');
                    
                    // УБРАНО: Показываем сообщение об успешном включении
                    // showMusicNotification("Музыка включена 🎵");
                }).catch(e => {
                    console.log("Ошибка воспроизведения музыки:", e.name);
                    
                    // Если есть ошибка автовоспроизведения
                    if (e.name === 'NotAllowedError') {
                        // УБРАНО: showMusicNotification("Разрешите автовоспроизведение в браузере");
                    } else if (e.name === 'NotSupportedError') {
                        // УБРАНО: showMusicNotification("Формат аудио не поддерживается");
                    }
                });
            }
        });
    }
    
    // Останавливаем всплытие событий в zero-секции
    if (zeroSection) {
        zeroSection.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Блокируем закрытие секции через Escape
    document.addEventListener('keydown', function(e) {
        if (zeroSection && !zeroSection.classList.contains('hidden')) {
            if (e.code === 'Escape') {
                e.preventDefault();
                // Не закрываем при Escape
            }
            // Разрешаем Enter и Space для фокуса на кнопку
            else if (e.code === 'Enter' || e.code === 'Space') {
                if (startButton) {
                    startButton.focus();
                    e.preventDefault(); // Предотвращаем прокрутку при Space
                }
            }
        }
    });
    
    // УБРАНА ФУНКЦИЯ: Функция показа уведомления о музыке
    // function showMusicNotification(message) {
    //     ...
    // }
    
    // УБРАНО: Анимация для уведомления
    // const style = document.createElement('style');
    // style.textContent = `
    //     @keyframes slideUp {
    //         from {
    //             opacity: 0;
    //             transform: translateX(-50%) translateY(20px);
    //         }
    //         to {
    //             opacity: 1;
    //             transform: translateX(-50%) translateY(0);
    //         }
    //     }
    //     
    //     .music-notification {
    //         animation: slideUp 0.3s ease;
    //     }
    // `;
    // document.head.appendChild(style);
});

// Сохраняем состояние музыки при закрытии страницы
// window.addEventListener('beforeunload', function() {
//     const weddingMusic = document.getElementById('wedding-music');
//     if (weddingMusic) {
//         localStorage.setItem('musicTime', weddingMusic.currentTime);
//     }
// });

// Дополнительно: Останавливаем музыку через 30 минут
setTimeout(() => {
    const weddingMusic = document.getElementById('wedding-music');
    if (weddingMusic && !weddingMusic.paused) {
        weddingMusic.pause();
        weddingMusic.currentTime = 0;
        localStorage.removeItem('musicPlaying')
    }
}, 1800000); // 30 минут = 1800000 мс
