axios BaseURL = 'https://final-project-utf-8-backend.onrender.com'

axios Headers.Authorization - потрібно вставити токен після реєстрації для роботи іншими роутами


axios.post("/register", {name,email,password} ); --реєстрація

authRouter.post(  "/login", {email,password} );  --вхід

authRouter.get("/current"); -перевіряє чи валідний токен в хедерсах і повертає юзера

authRouter.post("/logout"); - вихід 



axois.post('/subscribe',{email:'email'}); -- отримання підписки (поки що в процесі)
axois.get('/recipes/main-page'); --отримання рецептів по категоріям для головної сторінки
axois.get('/recipes/category-list'); --Cписок категорій Відсортований по алфавіту
axois.get(`/recipes/category/${category}`); -- отримання рецептів по категорії по 8 рецептів (category це id категорії) 
axois.get(`/recipes/${id}`); --отримання одного рецепта по id
axois.post('/search',{search:'слово по якму ведеться пошук'}); --пошук рецептів по ключовому слову в заголовку
axois.get('/ingredients/list'); --отримання списку інгрієнтів
axois.post('/ingredients', {id:'id інгредієнту'}); --пошук рецептів по інгрідієнту
axois.get('/ownRecipes'); --отримання рецептів створених цим же юзером
axois.post('/ownRecipes', body); --ендпоінт для додавання рецептy (поки що в процесі)
axois.patch('/ownRecipes', {id:'id рецепту'}); --ендпоінт для видалення рецептy по id якщо юзер його створив
axois.get('/favorite'); --отримання рецептів авторизованого користувача доданих ним же в обрані
axois.post('/favorite', {id:'id рецепту'} ); --ендпоінт для додавання рецептів до обраних
axois.patch('/favorite', {id:'id рецепту'}); --ендпоінт для видалення рецептів з обраних
axois.get('/popular-recipe'); --ендпоінт на отримання популярних рецептів. Популярність вираховується по тому, як багато користувачей додали рецепт у вибрані.
axois.post('/shopping-list',{id:'id інгредієнту'}); --ендпоінт для додавання продукту в список покупок користувача
axois.patch('/shopping-list', {id:'id інгредієнту'}); -- --ендпоінт для видалення продукту в список покупок користувача
axois.get('/shopping-list'); --ендпоінт для отримання продуктів зі списку покупок користувача
axois.get('/user-info'); --ендпоінт для отримання інформації про користувачаЖ кількість днів в додатку, кількість доданих рецептівдо обраних, список покупок користувача"