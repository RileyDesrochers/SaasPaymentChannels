def cal(p0, p, w, l):
    if l >= 4:
        return 0
    if w >= 2:
        return p
    return cal(p0, p*p0, w+1, l) + cal(p0, p*(1-p0), w, l+1)

print(cal(0.328, 1, 0, 0))