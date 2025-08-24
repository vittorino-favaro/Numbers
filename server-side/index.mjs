function gcd(i, j) {
  return !j ? i : gcd(j, i % j);
}

function powMod(b, e, m) {
  b = BigInt(b);
  m = BigInt(m);
  let pm = 1n;
  let sm = b % m;

  while (e) {
      pm = (e & 1) ? (pm * sm) % m : pm;
      sm = (sm * sm) % m;
      e /= 2;
  }

  return Number(pm);
}

function MillerRabinTest(n) {
  n = Number(n);

  if (!Number.isInteger(n)) {
      return null;
  }

  n = (n < 0) ? -n : n;

  if (n >= 341550071728321) {
      return undefined;
  }

  if (n < 2) {
      return false;
  }

  if (n == 2) {
      return true;
  }

  let s = 0;
  let t = n - 1;

  while (!(t & 1)) {
      s++;
      t /= 2;
  }

  if (s == 0) {
      return false;
  }

  const bs = [2, 3, 5, 7, 11, 13, 17];

  mainLoop: for (let b of bs) {
      if (b >= n) {
          return true;
      }

      if (gcd(b, n) > 1) {
          return false;
      }

      let e = t;
      let pm = powMod(b, e, n);

      if (pm == n - 1 || pm == 1) {
          continue;
      }

      for (let r = 1; r < s; r++) {
          e *= 2;
          pm = powMod(b, e, n);

          if (pm == n - 1) {
              continue mainLoop;
          }
      }

      return false;
  }

  return true;
}

export const handler = async (event) => {
  const ps = new URLSearchParams(event.rawQueryString);
  const n = ps.get("number");
  const r = {result:MillerRabinTest(n)};

  const response = {
    statusCode: 200,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
      },
    body: JSON.stringify(r)
  };

  return response;
};
