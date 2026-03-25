#include "agent.h"
#include <cstdlib>
#include <ctime>
#include <cmath>
#include <vector>
#include <algorithm>

void build_erdos_renyi(Agent* agents, int num_agents, double probability) {
    static bool seeded = false;
    if (!seeded) {
        srand(42);  
        seeded = true;
    }
    for (int i = 0; i < num_agents; i++) {
        agents[i].contact_count = 0;
    }
    
    for (int i = 0; i < num_agents; i++) {
        for (int j = i + 1; j < num_agents; j++) {
            double r = (double)rand() / RAND_MAX;
            if (r < probability) {
                if (agents[i].contact_count < MAX_CONTACTS) {
                    agents[i].contacts[agents[i].contact_count++] = j;
                }
                if (agents[j].contact_count < MAX_CONTACTS) {
                    agents[j].contacts[agents[j].contact_count++] = i;
                }
            }
        }
    }
}

void build_watts_strogatz(Agent* agents, int num_agents, int K, double rewiring_prob) {

    static bool seeded = false;
    if (!seeded) {
        srand(42);
        seeded = true;
    }
  
    for (int i = 0; i < num_agents; i++) {
        agents[i].contact_count = 0;
    }
    
    if (K % 2 != 0) K++;
    if (K >= num_agents) K = num_agents - 1;
    
    for (int i = 0; i < num_agents; i++) {
        for (int k = 1; k <= K/2; k++) {
            int neighbor = (i + k) % num_agents;
            if (agents[i].contact_count < MAX_CONTACTS) {
                agents[i].contacts[agents[i].contact_count++] = neighbor;
            }
        }
    }

    std::vector<bool> processed(num_agents, false);
    
    for (int i = 0; i < num_agents; i++) {
        for (int j = 0; j < agents[i].contact_count; j++) {
            int neighbor = agents[i].contacts[j];

            if (!processed[i] && i < neighbor) {
                double r = (double)rand() / RAND_MAX;
                if (r < rewiring_prob) {
                    int new_neighbor;
                    bool valid;
                    do {
                        new_neighbor = rand() % num_agents;
                        valid = (new_neighbor != i && new_neighbor != neighbor);
                        
                        for (int k = 0; k < agents[i].contact_count; k++) {
                            if (agents[i].contacts[k] == new_neighbor) {
                                valid = false;
                                break;
                            }
                        }
                    } while (!valid);
                  
                    for (int k = j; k < agents[i].contact_count - 1; k++) {
                        agents[i].contacts[k] = agents[i].contacts[k + 1];
                    }
                    agents[i].contact_count--;
                    
                    for (int k = 0; k < agents[neighbor].contact_count; k++) {
                        if (agents[neighbor].contacts[k] == i) {
                            for (int m = k; m < agents[neighbor].contact_count - 1; m++) {
                                agents[neighbor].contacts[m] = agents[neighbor].contacts[m + 1];
                            }
                            agents[neighbor].contact_count--;
                            break;
                        }
                    }
                    
                    if (agents[i].contact_count < MAX_CONTACTS) {
                        agents[i].contacts[agents[i].contact_count++] = new_neighbor;
                    }
                    if (agents[new_neighbor].contact_count < MAX_CONTACTS) {
                        agents[new_neighbor].contacts[agents[new_neighbor].contact_count++] = i;
                    }
                    
                    j--;
                }
            }
        }
        processed[i] = true;
    }
}
