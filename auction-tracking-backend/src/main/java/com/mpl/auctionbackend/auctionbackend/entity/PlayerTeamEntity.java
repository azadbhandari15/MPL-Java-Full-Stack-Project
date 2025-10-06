package com.mpl.auctionbackend.auctionbackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "player_team")
public class PlayerTeamEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String playerId;
    private String teamName;
    private Double purseAmount;
    @OneToMany(mappedBy = "playerTeamEntity")
    private Set<PlayerEntity> player;

}
