document.addEventListener('DOMContentLoaded', function() {
    const filterButton = document.querySelector('.filter-button');
    const filtersContainer = document.querySelector('.filters-container');
    const footerButtons = document.querySelector('.footer-buttons');


    filterButton.addEventListener('click', function() {
        filtersContainer.classList.toggle('active');
        filterButton.classList.toggle('active');

        if (filtersContainer.classList.contains('active')) {
             filtersContainer.style.display = 'flex';
             const maxHeight = filtersContainer.scrollHeight + 'px';
             filtersContainer.style.maxHeight = '0px';
             filtersContainer.offsetHeight;
             filtersContainer.style.maxHeight = maxHeight;
             footerButtons.classList.remove('top-radius');

        } else {
            filtersContainer.style.maxHeight = '0px';
            setTimeout(() => {
               filtersContainer.style.display = 'none'; 
              }, 500);
              setTimeout(() => {
                footerButtons.classList.add('top-radius');
                }, 100);
            
        }
    });

    const toggleButtons = document.querySelectorAll('.toggle-button');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const parentSection = button.closest('.filter-section');
            const parentMarketplaces = button.closest('.marketplaces');
            if (parentMarketplaces) {
                button.classList.toggle('active');
                return
            }
            if (parentSection && !parentMarketplaces) {
                parentSection.querySelectorAll('.toggle-button').forEach(btn => {
                    btn.classList.remove('active');
                    const circle = btn.querySelector('.circle');
                    if(circle){
                         circle.classList.remove('active');
                    }
                });
            }
            button.classList.add('active');
            const circle = button.querySelector('.circle');
                if(circle){
                    circle.classList.add('active');
            }
        });
    });
});