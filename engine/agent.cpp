#include "agent.h"
#include <cstdlib>
#include <ctime>
#include <cmath>
#include <random>

// Thread-local random number generators
static thread_local std::mt19937* local_rng = nullptr;

// Helper function to get thread-local RNG
static inline std::mt19937& get_rng(unsigned int seed) {
    if (local_rng == nullptr) {
        local_rng = new std::mt19937(seed);
    }
    return *local_rng;
}

void init_agents(Agent* agents, int num_agents, double beta, int num_initial_infected) {
    // Initialize all agents as susceptible
    for (int i = 0; i < num_agents; i++) {
        agents[i].id = i;
        agents[i].state = 'S';
        agents[i].contact_count = 0;
        agents[i].infection_prob = beta;
        agents[i].days_infected = 0;
    }
    
    // Set initial infected (patient zero/zeros)
    for (int i = 0; i < num_initial_infected && i < num_agents; i++) {
        agents[i].state = 'I';
        agents[i].days_infected = 1;
    }
}

void* update_agents(void* arg) {
    AgentBatch* batch = (AgentBatch*)arg;
    
    // Initialize thread-local RNG with per-thread seed
    std::mt19937& rng = get_rng(*batch->seed);
    std::uniform_real_distribution<double> dist(0.0, 1.0);
    
    for (int i = batch->start_idx; i < batch->end_idx; i++) {
        Agent& agent = batch->agents[i];
        
        // Skip recovered agents (they don't change)
        if (agent.state == 'R') continue;
        
        // Handle infected agents
        if (agent.state == 'I') {
            agent.days_infected++;
            // Recovery check
            double recovery_prob = batch->gamma;
            if (dist(rng) < recovery_prob) {
                agent.state = 'R';
                continue;
            }
        }
        
        // Handle exposed agents (incubation period)
        if (agent.state == 'E') {
            double incubation_prob = batch->sigma;
            if (dist(rng) < incubation_prob) {
                agent.state = 'I';
                agent.days_infected = 1;
            }
            continue;
        }
        
        // Handle susceptible agents - check contacts for infection
        if (agent.state == 'S') {
            // Check each contact
            for (int j = 0; j < agent.contact_count; j++) {
                int contact_id = agent.contacts[j];
                Agent& contact = batch->agents[contact_id];
                
                // If contact is infectious (I only - E is exposed but not yet infectious)
                if (contact.state == 'I') {
                    if (dist(rng) < agent.infection_prob) {
                        agent.state = 'E';
                        break;
                    }
                }
            }
        }
    }
    
    return NULL;
}

void count_states(Agent* agents, int num_agents, int& S, int& E, int& I, int& R) {
    S = E = I = R = 0;
    
    for (int i = 0; i < num_agents; i++) {
        switch (agents[i].state) {
            case 'S': S++; break;
            case 'E': E++; break;
            case 'I': I++; break;
            case 'R': R++; break;
        }
    }
}
