#ifndef AGENT_H
#define AGENT_H

#include <pthread.h>

#define MAX_CONTACTS 50

struct Agent {
    int id;
    char state;           // 'S', 'E', 'I', 'R'
    int contacts[MAX_CONTACTS];
    int contact_count;
    double infection_prob;
    int days_infected;    // For I state only
};

struct AgentBatch {
    Agent* agents;
    int start_idx;
    int end_idx;
    double beta;
    double gamma;
    double sigma;
    int current_day;
    unsigned int* seed;   // Per-thread random seed
};

void init_agents(Agent* agents, int num_agents, double beta, int num_initial_infected);
void* update_agents(void* arg);
void count_states(Agent* agents, int num_agents, int& S, int& E, int& I, int& R);

// Network construction functions
void build_erdos_renyi(Agent* agents, int num_agents, double probability);
void build_watts_strogatz(Agent* agents, int num_agents, int K, double rewiring_prob);

#endif // AGENT_H