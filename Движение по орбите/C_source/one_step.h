#pragma once

void euler(int n, double* xx, double* yy, double* vx, double* vy, double* ax, double* ay, double* mm, double dt) {
    double x, y, dx, dy, r, f;
    x = xx[0]; y = yy[0];
    ax[0] = 0; ay[0] = 0;
    for (int i = 1; i < n; i++) {
        dx = x - xx[i];
        dy = y - yy[i];
        r = sqrt(dx * dx + dy * dy);
        f = -1 * G * mm[i] / (r * r * r);
        ax[0] += f * dx;
        ay[0] += f * dy;
    }
    xx[0] = xx[0] + vx[0] * dt;
    yy[0] = yy[0] + vy[0] * dt;

    vx[0] = vx[0] + ax[0] * dt;
    vy[0] = vy[0] + ay[0] * dt;
}

void verlet(int n, double* xx, double* yy, double* vx, double* vy, double* ax, double* ay, double* mm, double dt) {
    double x0, y0, x1, y1, ax0, ay0, ax1, ay1, dx, dy, r, f;
    x0 = xx[0]; y0 = yy[0];
    ax0 = ay0 = 0;
    for (int i = 1; i < n; i++) {
        dx = x0 - xx[i];
        dy = y0 - yy[i];
        r = sqrt(dx * dx + dy * dy);
        f = -1 * G * mm[i] / (r * r * r);
        ax0 += f * dx;
        ay0 += f * dy;
    }
    xx[0] = xx[0] + vx[0] * dt + ax0 * dt * dt / 2;
    yy[0] = yy[0] + vy[0] * dt + ay0 * dt * dt / 2;
    x1 = xx[0]; y1 = yy[0];
    ax1 = ay1 = 0;
    for (int i = 1; i < n; i++) {
        dx = x1 - xx[i];
        dy = y1 - yy[i];
        r = sqrt(dx * dx + dy * dy);
        f = -1 * G * mm[i] / (r * r * r);
        ax1 += f * dx;
        ay1 += f * dy;
    }
    ax[0] = ax1;
    ay[0] = ay1;

    vx[0] = (ax0 + ax1) / 2 * dt + vx[0];
    vy[0] = (ay0 + ay1) / 2 * dt + vy[0];
}