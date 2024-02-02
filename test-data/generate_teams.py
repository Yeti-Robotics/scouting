import random as rnd
from generate_test_data import NpEncoder
import json

team_nums = [
    118,
    148,
    254,
    1678,
    3506,
    9998,
    900,
    1533,
    7890,
    4795,
    4829,
    179,
    180,
    8727,
    2910,
    1538,
    2485,
    3255,
    9449,
    3667,
    3647,
    4290,
    9006,
    4247,
    4414,
    1323,
    2565,
    4295,
    8116,
    9900,
    2582,
]

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
    "Salmon",
    "Tortoise",
    "Umbrellabird",
    "Vulture",
    "Walrus",
    "Xenops",
    "Yak",
    "Zebra",
]

with open("out/teams.json", "w") as fh:
    json.dump(
        [
            {
                "team_number": team,
                "team_name": rnd.choice(first_names)
                + rnd.choice(last_names)
                + str(index),
            }
            for index, team in enumerate(team_nums)
        ],
        fh,
        cls=NpEncoder,
    )
