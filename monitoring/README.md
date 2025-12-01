# Monitoring Setup - Prometheus & Grafana

This directory contains Kubernetes manifests for deploying Prometheus and Grafana monitoring stack.

## Prerequisites

- Kubernetes cluster with monitoring namespace
- Prometheus Operator (optional, for ServiceMonitor CRD)

## Deployment

### 1. Deploy Prometheus

```bash
kubectl apply -f prometheus-deployment.yaml
```

### 2. Deploy Grafana

```bash
kubectl apply -f grafana-deployment.yaml
```

### 3. Deploy ServiceMonitor (if using Prometheus Operator)

```bash
kubectl apply -f service-monitor.yaml
```

## Access

### Prometheus
```bash
kubectl port-forward -n monitoring svc/prometheus-service 9090:9090
```
Access at: http://localhost:9090

### Grafana
```bash
kubectl port-forward -n monitoring svc/grafana-service 3000:3000
```
Access at: http://localhost:3000
- Default username: admin
- Default password: admin123

## Dashboard Setup

1. Login to Grafana
2. Add Prometheus as a data source:
   - URL: http://prometheus-service:9090
   - Access: Server (default)
3. Import dashboards:
   - Kubernetes Cluster Monitoring
   - Node Exporter Full
   - Application Metrics

## Custom Metrics

To expose custom metrics from the backend:
- Add `/metrics` endpoint to the backend API
- Configure ServiceMonitor to scrape the metrics
- Create Grafana dashboards to visualize the metrics

## Persistence

Both Prometheus and Grafana use PersistentVolumeClaims for data persistence. Make sure your cluster supports dynamic volume provisioning.


