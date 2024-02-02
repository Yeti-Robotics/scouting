import numpy as np
import generate_users as users
import generate_standform as standform
import scipy.stats as sp
import json
import datetime

TEAMS = [
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
SCOUT_LIST = users.generate_users(18)
RELATIVE_SKILL = {team: sp.norm.cdf(np.random.normal()) for team in TEAMS}


# https://stackoverflow.com/questions/50916422/python-typeerror-object-of-type-int64-is-not-json-serializable
class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()
        return super(NpEncoder, self).default(obj)


def main():
    forms = []
    for match in range(80):
        scouts = np.random.choice(SCOUT_LIST, size=12, replace=False)
        teams = np.random.choice(TEAMS, size=6, replace=False)
        for i in range(12):
            bot = teams[i // 2]
            scout = scouts[i]
            alliance = "Red" if i < 6 else "Blue"
            forms.append(
                standform.generate_stand_form(
                    scout["username"], match + 1, alliance, bot, RELATIVE_SKILL[bot]
                )
            )
    with open("out/standforms.json", "w") as fh:
        json.dump(forms, fh, cls=NpEncoder)
    with open("out/users.json", "w") as fh:
        json.dump(SCOUT_LIST, fh, cls=NpEncoder)


if __name__ == "__main__":
    main()
