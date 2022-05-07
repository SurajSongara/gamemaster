from django.http import JsonResponse
from django.shortcuts import render
from games.models import Game,User,Score
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
import json
# Create your views here.

def home(request):
    all_games=Game.objects.all()
    return render(request,'home.html',context={'all_games':all_games[::-1]})


@login_required(login_url='/login/')
def open_game(request,name):
    print(name)
    print(f'games/{name}.html')
    return render(request,template_name=f'games/{name}.html')




def leaderboard(request,name):
    game_object=Game.objects.get(name=name)
    score_list=Score.objects.filter(game=game_object).order_by("-highscore")
    return render(request,template_name=f'dashboard.html',context={"scores":score_list})

@csrf_exempt
def updateScore(request):
    score=float(request.POST.get('Score'))
    game_name=request.POST.get('game')
    game_object=Game.objects.get_or_create(name=game_name)[0]
    data={"user":str(request.user)}
    data=json.dumps(data)
    score_object=Score.objects.get_or_create(user=request.user,game=game_object)[0]
    if score_object.highscore<score:
        score_object.highscore=score
    score_object.save()
    return JsonResponse(data,safe=False)


def search(request):
    search_query=request.GET.get("search_query")
    all_games=[]
    if search_query:
        all_games=Game.objects.filter(name__icontains=search_query)
    return render(request,'home.html',context={'all_games':all_games})