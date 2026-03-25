#ifndef SIR_H
#define SIR_H

struct Population {
    double S;
    double E;
    double I;
    double R;
    double beta;
    double gamma;
    double sigma;
    double mu;
};

void step_seir(Population& pop, double dt);
void step_sir(Population& pop, double dt);

#endif
