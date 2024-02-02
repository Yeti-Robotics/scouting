import random as rnd
import datetime

first_names = [
    "Amazing",
    "Beaming",
    "Clever",
    "Dazzling",
    "Enigmatic",
    "Fantastic",
    "Gracious",
    "Hungry",
    "Invisible",
    "Jolly",
    "Kind",
    "Lively",
    "Magnificent",
    "Nimble",
    "Omnipotent",
    "Professional",
    "Quiet",
    "Respectful",
    "Sensational",
    "Technical",
    "Ubiquitous",
    "Voracious",
    "Wonderful",
    "Xtreme",
    "Youthful",
    "Zippy",
]
last_names = [
    "Aardvark",
    "Bison",
    "Cat",
    "Dog",
    "Echidna",
    "Fox",
    "Giraffe",
    "Hippo",
    "Iguana",
    "Jaguar",
    "Koala",
    "Leopard",
    "Manatee",
    "Narwhal",
    "Octopus",
    "Penguin",
    "Quokka",
    "Racoon",
    "Snake",
    "Tortoise",
    "Umbrellabird",
    "Vulture",
    "Walrus",
    "Xenops",
    "Yak",
    "Zebra",
]


def generate_user(num):
    first_name, last_name = rnd.choice(first_names), rnd.choice(last_names)
    return {
        "username": first_name + last_name + str(num),
        "administrator": False,
        "password": "this_isnt_needed",
        "firstName": first_name,
        "lastName": last_name,
        "teamNumber": 3506,
        "banned": False,
        "bannedBy": None,
        "coins": 0,
        "canScout": True,
        "discordId": first_name + last_name + str(num),
        "createdAt": datetime.datetime.now(),
        "updatedAt": datetime.datetime.now(),
        "__v": 0,
    }


def generate_users(count: int):
    return [generate_user(num) for num in range(count)]
