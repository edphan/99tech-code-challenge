var sum_to_n_a = function(n) {
    let total = 0;
    for (let i = 1; i <= n; i += 1) {
        total += i;
    }
    return total;
};

var sum_to_n_b = function(n) {
    if (n <= 1) return n;
    return n + sum_to_n_b(n - 1);
};

var sum_to_n_c = function(n) {
    return (n * (n + 1)) / 2;
};