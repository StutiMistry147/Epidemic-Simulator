#include "sir.h"
#include <algorithm>
#include <cmath>

void step_seir(Population& pop, double dt) {
    double N = pop.S + pop.E + pop.I + pop.R;
    if (N < 1e-10) N = 1.0;
    
    auto dSdt = [&](double S, double E, double I) {
        return -pop.beta * S * I / N;
    };
    
    auto dEdt = [&](double S, double E, double I) {
        return pop.beta * S * I / N - pop.sigma * E;
    };
    
    auto dIdt = [&](double E, double I) {
        return pop.sigma * E - pop.gamma * I - pop.mu * I;
    };
    
    auto dRdt = [&](double I) {
        return pop.gamma * I;
    };
    
    double S1 = dSdt(pop.S, pop.E, pop.I);
    double E1 = dEdt(pop.S, pop.E, pop.I);
    double I1 = dIdt(pop.E, pop.I);
    double R1 = dRdt(pop.I);
    
    double S2 = dSdt(pop.S + 0.5*dt*S1, pop.E + 0.5*dt*E1, pop.I + 0.5*dt*I1);
    double E2 = dEdt(pop.S + 0.5*dt*S1, pop.E + 0.5*dt*E1, pop.I + 0.5*dt*I1);
    double I2 = dIdt(pop.E + 0.5*dt*E1, pop.I + 0.5*dt*I1);
    double R2 = dRdt(pop.I + 0.5*dt*I1);
    
    double S3 = dSdt(pop.S + 0.5*dt*S2, pop.E + 0.5*dt*E2, pop.I + 0.5*dt*I2);
    double E3 = dEdt(pop.S + 0.5*dt*S2, pop.E + 0.5*dt*E2, pop.I + 0.5*dt*I2);
    double I3 = dIdt(pop.E + 0.5*dt*E2, pop.I + 0.5*dt*I2);
    double R3 = dRdt(pop.I + 0.5*dt*I2);
    
    double S4 = dSdt(pop.S + dt*S3, pop.E + dt*E3, pop.I + dt*I3);
    double E4 = dEdt(pop.S + dt*S3, pop.E + dt*E3, pop.I + dt*I3);
    double I4 = dIdt(pop.E + dt*E3, pop.I + dt*I3);
    double R4 = dRdt(pop.I + dt*I3);
    
    pop.S += dt * (S1 + 2*S2 + 2*S3 + S4) / 6.0;
    pop.E += dt * (E1 + 2*E2 + 2*E3 + E4) / 6.0;
    pop.I += dt * (I1 + 2*I2 + 2*I3 + I4) / 6.0;
    pop.R += dt * (R1 + 2*R2 + 2*R3 + R4) / 6.0;
  
    pop.S = std::max(0.0, pop.S);
    pop.E = std::max(0.0, pop.E);
    pop.I = std::max(0.0, pop.I);
    pop.R = std::max(0.0, pop.R);
}
void step_sir(Population& pop, double dt) {
    double N = pop.S + pop.I + pop.R;
    if (N < 1e-10) N = 1.0;
    
    auto dSdt = [&](double S, double I) {
        return -pop.beta * S * I / N;
    };
    
    auto dIdt = [&](double S, double I) {
        return pop.beta * S * I / N - pop.gamma * I - pop.mu * I;
    };
    
    auto dRdt = [&](double I) {
        return pop.gamma * I;
    };
    
    double S1 = dSdt(pop.S, pop.I);
    double I1 = dIdt(pop.S, pop.I);
    double R1 = dRdt(pop.I);
    
    double S2 = dSdt(pop.S + 0.5*dt*S1, pop.I + 0.5*dt*I1);
    double I2 = dIdt(pop.S + 0.5*dt*S1, pop.I + 0.5*dt*I1);
    double R2 = dRdt(pop.I + 0.5*dt*I1);
    
    double S3 = dSdt(pop.S + 0.5*dt*S2, pop.I + 0.5*dt*I2);
    double I3 = dIdt(pop.S + 0.5*dt*S2, pop.I + 0.5*dt*I2);
    double R3 = dRdt(pop.I + 0.5*dt*I2);
    
    double S4 = dSdt(pop.S + dt*S3, pop.I + dt*I3);
    double I4 = dIdt(pop.S + dt*S3, pop.I + dt*I3);
    double R4 = dRdt(pop.I + dt*I3);
    
    pop.S += dt * (S1 + 2*S2 + 2*S3 + S4) / 6.0;
    pop.I += dt * (I1 + 2*I2 + 2*I3 + I4) / 6.0;
    pop.R += dt * (R1 + 2*R2 + 2*R3 + R4) / 6.0;
    
    pop.S = std::max(0.0, pop.S);
    pop.I = std::max(0.0, pop.I);
    pop.R = std::max(0.0, pop.R);
}
