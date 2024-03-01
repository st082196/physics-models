#include <stdio.h>
#define G 6.674e-11
#include "one_step.h"

int main()
{
    unsigned int n, nsteps, dprint;
    double dt;
    double *xx, *yy, *vx, *vy, *ax, *ay, *mm;

    FILE* input;
    if (fopen_s(&input, "input.txt", "r") == 0) {
        fscanf_s(input, "%u %lf %u %u\n", &n, &dt, &nsteps, &dprint);
        xx = malloc(n * sizeof(double)); yy = malloc(n * sizeof(double));
        vx = malloc(n * sizeof(double)); vy = malloc(n * sizeof(double));
        ax = malloc(n * sizeof(double)); ay = malloc(n * sizeof(double));
        mm = malloc(n * sizeof(double));
        for (int i = 0; i < n; i++) {
            fscanf_s(input, "%lf %lf %lf %lf %lf\n", &xx[i], &yy[i], &vx[i], &vy[i], &mm[i]);
            printf("%lf %lf %lf %lf %lf\n", xx[i], yy[i], vx[i], vy[i], mm[i]);
        }
        fclose(input);
    }
    else {
        printf("Input file not found");
        return 0;
    }

    FILE* output;
    fopen_s(&output, "output.txt", "w");
    fprintf(output, "%f %f\n", xx[0], yy[0]);
    for (int i = 0; i < nsteps; i++) {
        verlet(n, xx, yy, vx, vy, ax, ay, mm, dt);
        if ((i + 1) % dprint == 0) fprintf(output, "%f %f\n", xx[0], yy[0]);
    }
    if (nsteps % dprint != 0) fprintf(output, "%f %f\n", xx[0], yy[0]);
}