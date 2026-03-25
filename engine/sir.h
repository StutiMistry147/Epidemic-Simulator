#ifndef SIR_H
#define SIR_H

struct Population {
    double S;      // Susceptible
    double E;      // Exposed
    double I;      // Infected
    double R;      // Recovered/Removed
    double beta;   // Infection rate
    double gamma;  // Recovery rate
    double sigma;  // Incubation rate (1/incubation period)
    double mu;     // Mortality rate (optional)
};

// Step functions using RK4 integration
void step_seir(Population& pop, double dt);
void step_sir(Population& pop, double dt);

#endif // SIR_H