from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Game(models.Model):
    name=models.CharField(max_length=100,verbose_name='Game Name')
    thumbnail = models.ImageField(upload_to='game', blank=True, null=True,default='game/default.jpg')
    description = models.TextField(verbose_name='Details',blank=True,null=True)
    def __str__(self) -> str:
        return self.name
    
class Score(models.Model):
    game=models.ForeignKey(Game,on_delete=models.CASCADE)
    highscore=models.FloatField(verbose_name='highscore',default=0)
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    
    def __str__(self) -> str:
        return self.game.name+" "+self.user.username