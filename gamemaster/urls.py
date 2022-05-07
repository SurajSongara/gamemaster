from django.contrib import admin
from django.urls import path
from users.views import login, signup, logout
from games.views import home, leaderboard,open_game,updateScore,search
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home,name='home'),
    path('game/<str:name>/',open_game,name='game'),
    path('leaderboard/<str:name>/',leaderboard,name='leaderboard'),
    path('updatescore/',updateScore,name="update_score"),
    path('search/',search,name='search'),
    path('login/', login, name='login'),
    path('signup/', signup, name='signup'),
    path('logout/', logout, name='logout'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)