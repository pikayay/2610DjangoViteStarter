from django.shortcuts import render
from django.conf  import settings
import json
import os
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.forms.models import model_to_dict
from .models import Post

# Load manifest when server launches
MANIFEST = {}
if not settings.DEBUG:
    f = open(f"{settings.BASE_DIR}/core/static/manifest.json")
    MANIFEST = json.load(f)

# Create your views here.
@login_required
def index(req):
    context = {
        "asset_url": os.environ.get("ASSET_URL", ""),
        "debug": settings.DEBUG,
        "manifest": MANIFEST,
        "js_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["file"],
        "css_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["css"][0]
    }
    return render(req, "core/index.html", context)


@login_required
def me(req):
    # returning a JSON string back to the browser eventually through an HTTPResponse
    return JsonResponse({"user": model_to_dict(req.user)})


@login_required
def posts(req):
    if req.method == "POST":
        body = json.loads(req.body)
        post = Post(
            title=body["title"],
            user=req.user
        )

        post.save()
        return JsonResponse({"post": model_to_dict(post)})
    
    posts = [model_to_dict(post) for post in req.user.post_set.all()] # might be user.note_set.all()
    return JsonResponse({"posts": posts})